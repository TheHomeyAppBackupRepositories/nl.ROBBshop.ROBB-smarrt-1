'use strict';

const { ZigBeeDevice, Util } = require('homey-zigbeedriver');
const { debug, CLUSTER } = require('zigbee-clusters');
const ROBBSpecificOnOffCluster = require('./Clusters/ROBBSpecificOnOffCluster');
const ROBBSpecificBasicCluster = require('./Clusters/ROBBSpecificBasicCluster');

class ZBSwitchDevice extends ZigBeeDevice {

  async onNodeInit({ zclNode }) {
    // this.enableDebug();

    // this.printNode();

    // Enables debug logging in zigbee-clusters
    // debug(true);

    // await super.onNodeInit({ zclNode });

    const subDeviceId = this.isSubDevice() ? this.getData().subDeviceId : 'firstOutlet';
    this.log('Initializing', subDeviceId, 'at endpoint', this.endpointIds[subDeviceId]);

    // onoff
    if (this.hasCapability('onoff')) {
      this.registerCapability('onoff', CLUSTER.ON_OFF, {
        endpoint: this.endpointIds[subDeviceId],
      });
    }

    // measure_power
    if (this.hasCapability('measure_power')) {

      // Define electricaMeasurement cluster attribute reporting and parsing options. Do NOT await this.initElectricalMeasurementClusterAttributeReporting()
      if (!this.activePowerFactor) this.initElectricalMeasurementClusterAttributeReporting({ zclNode });

      this.registerCapability('measure_power', CLUSTER.ELECTRICAL_MEASUREMENT, {
        /*reportOpts: {
          configureAttributeReporting: {
            minInterval: 0,
            maxInterval: 300,
            minChange: 1 / (this.activePowerFactor || 0.1),
          },
        },*/
        endpoint: this.isSubDevice() ? 2 : 1,
      });

    }

    if (this.hasCapability('meter_power')) {

      if (!this.hasCapability('button.reset_meter')) {
        await this.addCapability('button.reset_meter').catch(this.error);
      }

      // Define Metering cluster attribute reporting and parsing options. Do NOT await this.initMeteringClusterAttributeReporting()
      if (!this.meteringFactor) this.initMeteringClusterAttributeReporting({ zclNode });

      this.registerCapability('meter_power', CLUSTER.METERING, {
        /*reportOpts: {
          configureAttributeReporting: {
            minInterval: 0, // No minimum reporting interval
            maxInterval: 3600, // Maximally every ~16 hours
            minChange: 1 / ( this.meteringFactor || 1/3600000), // Report when value changed by 5
          },
        },*/
        reportParser(value) {
          const meteringFactor = this.meteringFactor || 1;
          const referenceCurrentSummationDelivered = this.referenceCurrentSummationDelivered || 0;
          if (value < 0) return null;
          this.debug('METER_POWER value received', value, value * meteringFactor, 'parsed as', (value - referenceCurrentSummationDelivered) * meteringFactor);
          return (value - referenceCurrentSummationDelivered) * meteringFactor;
        },
        endpoint: this.isSubDevice() ? 2 : 1,
      });

      this.registerCapabilityListener('button.reset_meter', async () => {
        try {
          await this.setRefCurrentSummationDelivered();
          // set meter_power capability value
          this.setCapabilityValue('meter_power', 0).catch(this.error);
          this.log('MaintenanceAction | Reset meter - completed successfully');
        } catch (err) {
          this.debug('MaintenanceAction | Reset meter - ERROR: Could not complete maintenanceAction:', err);
          throw new Error('Something went wrong');
        }
        // Maintenance action button was pressed, return a promise
        return true;
      });
    }
  }

  async initSettings() {
    const { startupOnOff } = await this.zclNode.endpoints[this.getClusterEndpoint(ROBBSpecificOnOffCluster)].clusters[ROBBSpecificOnOffCluster.NAME].readAttributes(['startupOnOff']).catch(this.error);
    const { switchType } = await this.zclNode.endpoints[this.getClusterEndpoint(ROBBSpecificBasicCluster)].clusters[ROBBSpecificBasicCluster.NAME].readAttributes(['switchType']).catch(this.error);
    this.log('READ, startupOnOff', startupOnOff, 'switchType', switchType);
  }

  async initMeteringClusterAttributeReporting({ zclNode }) {
    if (!this.getStoreValue('meteringFactor')) {
      try {
        const { multiplier, divisor } = await this.zclNode.endpoints[this.isSubDevice() ? 2 : 1].clusters[CLUSTER.METERING.NAME].readAttributes(['multiplier', 'divisor']).catch(this.error);
        this.meteringFactor = multiplier / divisor;
        this.setStoreValue('meteringFactor', this.meteringFactor).catch(this.error);
        this.debug('meteringFactor read from multiplier and divisor attributes:', multiplier, divisor, this.meteringFactor);
      } catch (error) {
        this.meteringFactor = 1/3600000 ; // fall back, not stored. Will be retried at the next onNodeInit
        this.debug('meteringFactor NOT read from multiplier and divisor attributes, due to', error);
      }
    } else {
      this.meteringFactor = this.getStoreValue('meteringFactor');
      this.debug('meteringFactor retrieved from Store:', this.meteringFactor);
    }
    this.log('Defined meteringFactor:', this.meteringFactor);
    this.debug('--  initializing attribute reporting for the metering cluster');
    await this.configureAttributeReporting([{
      cluster: CLUSTER.METERING,
      attributeName: 'currentSummationDelivered',
      minInterval: 300,
      maxInterval: 3600,
      minChange: 0.01 / this.meteringFactor,
      endpointId: this.isSubDevice() ? 2 : 1,
    }]).catch(this.error);

    this.debug('--  initializing referenceCurrentSummationDelivered for the meteringCluster');
    if (this.isFirstInit()) {
      await this.setRefCurrentSummationDelivered();
      this.setCapabilityValue('meter_power', 0).catch(this.error);
      this.debug('Set referenceCurrentSummationDelivered by reading attributes:', this.referenceCurrentSummationDelivered);
    } else if (!this.getStoreValue('referenceCurrentSummationDelivered')) {
      this.referenceCurrentSummationDelivered = 0;
      this.debug('storeValue for referenceCurrentSummationDelivered not defined, set to 0');
    } else {
      this.referenceCurrentSummationDelivered = this.getStoreValue('referenceCurrentSummationDelivered');
      this.debug('retrieving referenceCurrentSummationDelivered from Store:', this.referenceCurrentSummationDelivered);
    }
    this.log('Defined referenceCurrentSummationDelivered:', this.referenceCurrentSummationDelivered);
  }

  async initElectricalMeasurementClusterAttributeReporting({ zclNode }) {
    if (!this.getStoreValue('activePowerFactor')) {
      try {
        const {acPowerMultiplier, acPowerDivisor} = await this.zclNode.endpoints[this.isSubDevice() ? 2 : 1].clusters[CLUSTER.ELECTRICAL_MEASUREMENT.NAME]
        .readAttributes(['acPowerMultiplier', 'acPowerDivisor'])
        this.activePowerFactor = acPowerMultiplier / acPowerDivisor;
        this.setStoreValue('activePowerFactor', this.activePowerFactor).catch(this.error);
        this.debug('activePowerFactor read from acPowerMultiplier and acPowerDivisor attributes:', acPowerMultiplier, acPowerDivisor, this.activePowerFactor);
      } catch (error) {
        this.activePowerFactor = 0.1; // fall back, not stored. Will be retried at the next onNodeInit
        this.debug('activePowerFactor NOT read from acPowerMultiplier and acPowerDivisor attributes, due to', error);
      }
    } else {
      this.activePowerFactor = this.getStoreValue('activePowerFactor');
      this.debug('activePowerFactor retrieved from Store:', this.activePowerFactor);
    }
    this.log('Defined activePowerFactor:', this.activePowerFactor);
    this.debug('--  initializing attribute reporting for the electricalMeasurement cluster');
    await this.configureAttributeReporting([{
      cluster: CLUSTER.ELECTRICAL_MEASUREMENT,
      attributeName: 'activePower',
      minInterval: 5,
      maxInterval: 300,
      minChange: 0.5 / this.activePowerFactor,
      endpointId: this.isSubDevice() ? 2 : 1,
    },
    // disable rmsVoltage and rmsCurrent attributeReporting, do NOT await this.initDisableVoltageCurrentReporting()
    {
      endpointId: this.isSubDevice() ? 2 : 1,
      cluster: CLUSTER.ELECTRICAL_MEASUREMENT,
      attributeName: 'rmsVoltage',
      minInterval: 0,
      maxInterval: 65535,
      minChange: 10,
    },
    {
      endpointId: this.isSubDevice() ? 2 : 1,
      cluster: CLUSTER.ELECTRICAL_MEASUREMENT,
      attributeName: 'rmsCurrent',
      minInterval: 0,
      maxInterval: 65535,
      minChange: 10,
    }]).catch(this.error);
  }

  async setRefCurrentSummationDelivered() {
    // read actual currentSummationDelivered attribute value
    const { currentSummationDelivered } = await this.zclNode.endpoints[this.isSubDevice() ? 2 : 1].clusters[CLUSTER.METERING.NAME].readAttributes(['currentSummationDelivered']).catch(this.error);

    // update reference currentSummationDelivered based on actual
    this.referenceCurrentSummationDelivered = currentSummationDelivered;

    // update Store value
    this.setStoreValue('referenceCurrentSummationDelivered', this.referenceCurrentSummationDelivered).catch(this.error);
  }

  async onSettings({ oldSettings, newSettings, changedKeys }) {
    if (changedKeys.includes('switch_type')) {
      await Util.wrapAsyncWithRetry(() => this.zclNode.endpoints[this.getClusterEndpoint(ROBBSpecificBasicCluster)].clusters[ROBBSpecificBasicCluster.NAME]
        .writeAttributes({ switchType: newSettings.switch_type }), 3)
        .then(this.log('SETTINGS | Write Attribute - Robb Specific Basic Cluster - switchType', newSettings.switch_type))
        .catch(this.error);
    }

    if (changedKeys.includes('save_state')) {
      await Util.wrapAsyncWithRetry(() => this.zclNode.endpoints[this.getClusterEndpoint(ROBBSpecificOnOffCluster)].clusters[ROBBSpecificOnOffCluster.NAME]
        .writeAttributes({ startupOnOff: newSettings.save_state }), 3)
        .then(this.log('SETTINGS | Write Attribute - Robb Specific OnOff Cluster - startupOnOff', newSettings.save_state))
        .catch(this.error);
    }
  }

}

module.exports = ZBSwitchDevice;

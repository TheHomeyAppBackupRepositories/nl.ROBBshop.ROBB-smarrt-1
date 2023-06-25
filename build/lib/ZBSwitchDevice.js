'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { debug, CLUSTER } = require('zigbee-clusters');

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

    if (this.hasCapability('button.reset_meter')) {
      await this.removeCapability('button.reset_meter').catch(this.error);
    }

    // measure_power
    if (this.hasCapability('measure_power')) {
      this.log('RETRIEVED configureAttributeReporting', this.getStoreValue('configuredAttributeReporting'));

      // Define acPower parsing factor based on device settings

      if (!this.activePowerFactor) {
        // this.log("DEBUG: not meteringFactor", typeof this.getStoreValue('meteringFactor') !== 'number', !this.getStoreValue('meteringFactor'), !this.getStoreValue('meteringFactor2'));
        if (!this.getStoreValue('activePowerFactor')) {
          const { acPowerMultiplier, acPowerDivisor } = await zclNode.endpoints[this.getClusterEndpoint(CLUSTER.ELECTRICAL_MEASUREMENT)].clusters[CLUSTER.ELECTRICAL_MEASUREMENT.NAME].readAttributes('acPowerMultiplier', 'acPowerDivisor');
          this.activePowerFactor = acPowerMultiplier / acPowerDivisor;
          this.setStoreValue('activePowerFactor', this.activePowerFactor);
          this.debug('activePowerFactor read from acPowerMultiplier and acPowerDivisor attributes:', acPowerMultiplier, acPowerDivisor, this.activePowerFactor);
        } else {
          this.activePowerFactor = this.getStoreValue('activePowerFactor');
          this.debug('activePowerFactor retrieved from Store:', this.activePowerFactor);
        }
        this.log('Defined activePowerFactor:', this.activePowerFactor);
      }

      this.registerCapability('measure_power', CLUSTER.ELECTRICAL_MEASUREMENT, {
        reportOpts: {
          configureAttributeReporting: {
            minInterval: 0, // No minimum reporting interval
            maxInterval: 300, // Maximally every ~16 hours
            minChange: 1 / this.activePowerFactor, // Report when value changed by 5
          },
        },
        endpoint: this.isSubDevice() ? 2 : 1,
        // this.getClusterEndpoint(CLUSTER.ELECTRICAL_MEASUREMENT),
      });

      // disable rmsVoltage and rmsCurrent attributeReporting
      try {
        await this.configureAttributeReporting([
          {
            endpointId: this.isSubDevice() ? 2 : 1, // this.getClusterEndpoint(CLUSTER.ELECTRICAL_MEASUREMENT),
            cluster: CLUSTER.ELECTRICAL_MEASUREMENT,
            attributeName: 'rmsVoltage',
            minInterval: 0,
            maxInterval: 65535,
            minChange: 10,
          },
        ]);
        await this.configureAttributeReporting([
          {
            endpointId: this.isSubDevice() ? 2 : 1, // this.getClusterEndpoint(CLUSTER.ELECTRICAL_MEASUREMENT),
            cluster: CLUSTER.ELECTRICAL_MEASUREMENT,
            attributeName: 'rmsCurrent',
            minInterval: 0,
            maxInterval: 65535,
            minChange: 10,
          },
        ]);
      } catch (err) {
        this.error('failed disabling configureAttributeReporting for rmsVoltage and rmsCurrent', err);
      }
    }

    if (this.hasCapability('meter_power')) {
      // Define acPower parsing factor based on device settings
      //

      if (!this.hasCapability('button.reset_meter')) {
        await this.addCapability('button.reset_meter').catch(this.error);
      }

      if (!this.referenceCurrentSummationDelivered) {
        if (this.isFirstInit()) {
          await this.setRefCurrentSummationDelivered();
          this.setCapabilityValue('meter_power', 0);
          this.debug('Set referenceCurrentSummationDelivered by reading attributes:', this.referenceCurrentSummationDelivered);
        } else if (!this.getStoreValue('referenceCurrentSummationDelivered')) {
          this.referenceCurrentSumDelivered = 0;
          this.debug('storeValue for referenceCurrentSummationDelivered not defined, set to 0');
        } else {
          this.referenceCurrentSummationDelivered = this.getStoreValue('referenceCurrentSummationDelivered');
          this.debug('retrieving referenceCurrentSummationDelivered from Store:', this.referenceCurrentSummationDelivered);
        }
        this.log('Defined referenceCurrentSummationDelivered:', this.referenceCurrentSummationDelivered);
      }

      if (!this.meteringFactor) {
        // this.log("DEBUG: not meteringFactor", typeof this.getStoreValue('meteringFactor') !== 'number', !this.getStoreValue('meteringFactor'), !this.getStoreValue('meteringFactor2'));
        if (!this.getStoreValue('meteringFactor')) {
          const { multiplier, divisor } = await zclNode.endpoints[this.isSubDevice() ? 2 : 1].clusters[CLUSTER.METERING.NAME].readAttributes('multiplier', 'divisor');
          this.meteringFactor = multiplier / divisor;
          this.setStoreValue('meteringFactor', this.meteringFactor);
          this.debug('meteringFactor read from multiplier and divisor attributes:', multiplier, divisor, this.meteringFactor);
        } else {
          this.meteringFactor = this.getStoreValue('meteringFactor');
          this.debug('meteringFactor retrieved from Store:', this.meteringFactor);
        }
        this.log('Defined meteringFactor:', this.meteringFactor);
      }

      this.registerCapabilityListener('button.reset_meter', async () => {
        try {
          await this.setRefCurrentSummationDelivered();

          // set meter_power capability value
          this.setCapabilityValue('meter_power', 0);
          this.log('MaintenanceAction | Reset meter - completed successfully');
        } catch (err) {
          this.debug('MaintenanceAction | Reset meter - ERROR: Could not complete maintenanceAction:', err);
          throw new Error('Something went wrong');
        }
        // Maintenance action button was pressed, return a promise
        return true;
      });

      this.registerCapability('meter_power', CLUSTER.METERING, {
        reportOpts: {
          configureAttributeReporting: {
            minInterval: 0, // No minimum reporting interval
            maxInterval: 3600, // Maximally every ~16 hours
            minChange: 0.01 / this.meteringFactor, // Report when value changed by 5
          },
        },
        reportParser(value) {
          const meteringFactor = this.meteringFactor || 1;
          const referenceCurrentSummationDelivered = this.referenceCurrentSummationDelivered || 0;
          if (value < 0) return null;
          this.debug('METER_POWER value received', value, value * meteringFactor, 'parsed as', (value - referenceCurrentSummationDelivered) * meteringFactor);
          return (value - referenceCurrentSummationDelivered) * meteringFactor;
        },
        // reportParser = value * this.meteringFactor - this.referenceCurrentSumDelivered
        endpoint: this.isSubDevice() ? 2 : 1,
      });
    }
  }

  async setRefCurrentSummationDelivered() {
    // read actual currentSummationDelivered attribute value
    const { currentSummationDelivered } = await this.zclNode.endpoints[this.isSubDevice() ? 2 : 1].clusters[CLUSTER.METERING.NAME].readAttributes('currentSummationDelivered');

    // update reference currentSummationDelivered based on actual
    this.referenceCurrentSummationDelivered = currentSummationDelivered;

    // update Store value
    this.setStoreValue('referenceCurrentSummationDelivered', this.referenceCurrentSummationDelivered);
  }

}

module.exports = ZBSwitchDevice;

'use strict';

const { ZigBeeLightDevice, Util } = require('homey-zigbeedriver');
const { debug, CLUSTER } = require('zigbee-clusters');
const ROBBSpecificOnOffCluster = require('./Clusters/ROBBSpecificOnOffCluster');
const ROBBSpecificBasicCluster = require('./Clusters/ROBBSpecificBasicCluster');

class ZBDimmerDevice extends ZigBeeLightDevice {

  async onNodeInit({ zclNode }) {
    // this.enableDebug();

    // this.printNode();

    // Enables debug logging in zigbee-clusters
    // debug(true);

    await super.onNodeInit({ zclNode });

    if(this.hasCapability('onoff')) {
      this.registerCapability('onoff', CLUSTER.ON_OFF, {
        endpoint: 1,
      });
    }

    if(this.hasCapability('dim')) {
      this.registerCapability('dim', CLUSTER.LEVEL_CONTROL, {
        endpoint: 1,
      });
    }

    // measure_power
    if (this.hasCapability('measure_power')) {

      // Define electricaMeasurement cluster attribute reporting and parsing options. Do NOT await this.initElectricalMeasurementClusterAttributeReporting()
      if (!this.activePowerFactor) this.initElectricalMeasurementClusterAttributeReporting({ zclNode });

      this.registerCapability('measure_power', CLUSTER.ELECTRICAL_MEASUREMENT, {
        /*reportOpts: {
          configureAttributeReporting: {
            minInterval: 5, // No minimum reporting interval
            maxInterval: 300, // Maximally every ~16 hours
            minChange: 1 / this.activePowerFactor, // Report when value changed by 5
          },
        },*/
        endpoint: this.getClusterEndpoint(CLUSTER.ELECTRICAL_MEASUREMENT),
      });

      this.initSettings();

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
            minInterval: 10, // No minimum reporting interval
            maxInterval: 3600, // Maximally every ~16 hours
            minChange: 0.01 / this.meteringFactor, // Report when value changed by 5
          },
        },*/
        reportParser(value) {
          const meteringFactor = this.meteringFactor || 1;
          const referenceCurrentSummationDelivered = this.referenceCurrentSummationDelivered || 0;
          if (value < 0) return null;
          this.debug('METER_POWER value received', value, value * meteringFactor, 'parsed as', (value - referenceCurrentSummationDelivered) * meteringFactor);
          return (value - referenceCurrentSummationDelivered) * meteringFactor;
        },
        endpoint: this.getClusterEndpoint(CLUSTER.METERING),
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
    try {
      const { startupOnOff } = await this.zclNode.endpoints[this.getClusterEndpoint(ROBBSpecificOnOffCluster)].clusters[ROBBSpecificOnOffCluster.NAME].readAttributes(['startupOnOff']).catch(this.error);
      this.log('READ, startupOnOff', startupOnOff);
      await this.setSettings({ save_state: startupOnOff});
    } catch (err) {
      this.log('could not read Attribute startupOnOff or set these settings to the read values:', err);
    }

    try {
      const { switchType } = await this.zclNode.endpoints[this.getClusterEndpoint(ROBBSpecificBasicCluster)].clusters[ROBBSpecificBasicCluster.NAME].readAttributes(['switchType']).catch(this.error);
      this.log('READ, switchType', switchType);
      await this.setSettings({ switch_type: switchType.toString()});
    } catch (err) {
      this.log('could not read Attribute switchType or set these settings to the read values:', err);
    }
  }


  async initMeteringClusterAttributeReporting({ zclNode }) {
    if (!this.getStoreValue('meteringFactor')) {
      try {
        const { multiplier, divisor } = await this.zclNode.endpoints[this.getClusterEndpoint(CLUSTER.METERING)].clusters[CLUSTER.METERING.NAME].readAttributes(['multiplier', 'divisor']).catch(this.error);
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
      endpointId: this.getClusterEndpoint(CLUSTER.METERING),
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
        const {acPowerMultiplier, acPowerDivisor} = await this.zclNode.endpoints[this.getClusterEndpoint(CLUSTER.ELECTRICAL_MEASUREMENT)].clusters[CLUSTER.ELECTRICAL_MEASUREMENT.NAME]
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
      endpointId: this.getClusterEndpoint(CLUSTER.ELECTRICAL_MEASUREMENT),
    },
    // disable rmsVoltage and rmsCurrent attributeReporting, do NOT await this.initDisableVoltageCurrentReporting()
    {
      endpointId: this.getClusterEndpoint(CLUSTER.ELECTRICAL_MEASUREMENT),
      cluster: CLUSTER.ELECTRICAL_MEASUREMENT,
      attributeName: 'rmsVoltage',
      minInterval: 0,
      maxInterval: 65535,
      minChange: 10,
    },
    {
      endpointId: this.getClusterEndpoint(CLUSTER.ELECTRICAL_MEASUREMENT),
      cluster: CLUSTER.ELECTRICAL_MEASUREMENT,
      attributeName: 'rmsCurrent',
      minInterval: 0,
      maxInterval: 65535,
      minChange: 10,
    }]).catch(this.error);
  }

  async setRefCurrentSummationDelivered() {
    // read actual currentSummationDelivered attribute value
    const { currentSummationDelivered } = await this.zclNode.endpoints[this.getClusterEndpoint(CLUSTER.METERING)].clusters[CLUSTER.METERING.NAME].readAttributes(['currentSummationDelivered']).catch(this.error);

    // update reference currentSummationDelivered based on actual
    this.referenceCurrentSummationDelivered = currentSummationDelivered;

    // update Store value
    this.setStoreValue('referenceCurrentSummationDelivered', this.referenceCurrentSummationDelivered).catch(this.error);
  }

  // SDK3 TODO: update settings execution zclNode
  async onSettings({ oldSettings, newSettings, changedKeys }) {
    let changeSettingError = '';

    this.log(changedKeys);
    this.log('newSettings', newSettings);
    this.log('oldSettings', oldSettings);

    // Loop all changed settings
    for (const changedKey of changedKeys) {
      const newValue = newSettings[changedKey];

      try {
        if (changedKey.includes('forced_brightness_level')) {
          this.log('forced_brightness_level: ', changedKey, newValue, Math.min(newValue * 2.55, 255));
          await Util.wrapAsyncWithRetry(() => this.zclNode.endpoints[this.getClusterEndpoint(CLUSTER.LEVEL_CONTROL)].clusters[CLUSTER.LEVEL_CONTROL.NAME]
          .writeAttributes({ onLevel: Math.min(newValue * 2.55, 255) }) ,3)
          .then(this.log('SETTINGS | Write Attribute - Level Contro Cluster - onLevel', newSettings.forced_brightness_level))
          .catch(this.error);
        }

        if (changedKey.includes('dim_transition_time')) {
          this.log('dim_transition_time: ', changedKey, newValue);
          await Util.wrapAsyncWithRetry(() => this.zclNode.endpoints[this.getClusterEndpoint(CLUSTER.LEVEL_CONTROL)].clusters[CLUSTER.LEVEL_CONTROL.NAME]
          .writeAttributes({ onOffTransitionTime: newValue }), 3)
          .then(this.log('SETTINGS | Write Attribute - Level Contro Cluster - onOffTransitionTime', newSettings.dim_transition_time))
          .catch(this.error);
        }

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
      } catch (err) {
        this.error(`failed_to_set_${changedKey}_to_${newValue}`, err);
        let errorString = `${changeSettingError}failed_to_set_${changedKey}_to_${newValue}`;
        if (changeSettingError.length > 0) errorString = `_${errorString}`;
        changeSettingError = errorString;
      }
    }

    // If one or more of the settings failed to set, reject
    if (changeSettingError.length > 0) return Promise.reject(new Error(changeSettingError));

    // Compose save message
    const saveMessage = 'successfully saved the changed settings';

    return super.onSettings({oldSettings, newSettings, changedKeys});
  }

}

module.exports = ZBDimmerDevice;

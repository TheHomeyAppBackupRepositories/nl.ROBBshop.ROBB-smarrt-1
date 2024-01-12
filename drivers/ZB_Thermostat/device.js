'use strict'

const Capability2Mode = {
  manual: 'heat',
  auto: 'auto',
  dry: 'dry',
  off: 'off',
  away: 'away',
}

const Mode2Capability = {
  heat: 'manual',
  auto: 'auto',
  dry: 'dry',
  off: 'off',
  away: 'away',
}

const { ZigBeeDevice } = require('homey-zigbeedriver')
const { debug, CLUSTER, Cluster, ZCLDataType, ZCLDataTypes} = require('zigbee-clusters')
const ROBBSpecificThermostatCluster = require('../../lib/Clusters/ROBBSpecificThermostatCluster')
const ROBBSpecificThermostatUIConfigurationCluster = require('../../lib/Clusters/ROBBSpecificThermostatUIConfigurationCluster')
const ROBBSpecificElectricalMeasurementCluster = require('../../lib/Clusters/ROBBSpecificElectricalMeasurementCluster')
const ROBBSpecificAlarmsCluster = require('../../lib/Clusters/ROBBSpecificAlarmsCluster')

Cluster.addCluster(ROBBSpecificThermostatCluster)
Cluster.addCluster(ROBBSpecificAlarmsCluster)
Cluster.addCluster(ROBBSpecificElectricalMeasurementCluster)
Cluster.addCluster(ROBBSpecificThermostatUIConfigurationCluster);

class ZBThermostatDevice extends ZigBeeDevice {

  async onNodeInit ({
    zclNode, node,
  }) {
    super.onNodeInit(
      { zclNode, node })

    // Enables debug logging in zigbee-clusters
    // debug(true);

    // enable debugging
    this.enableDebug();

    // print the node's info to the console
    // this.printNode();

    this._registerSettingsListeners();

    this._thermostatCluster = this.zclNode.endpoints[1].clusters[ROBBSpecificThermostatCluster.NAME];

    if(this.hasCapability('target_temperature')) {
      this._thermostatCluster.on('attr.occupiedHeatingSetpoint', this.onTargetTemperatureAttributeReport.bind(this, 'occupiedHeatingSetpoint', 'report'));
      this._thermostatCluster.on('attr.unoccupiedHeatingSetpoint', this.onTargetTemperatureAttributeReport.bind(this, 'unoccupiedHeatingSetpoint', 'report'));

      // occupied: auto / manual / dry
      this.registerCapabilityListener('target_temperature',
        async (value, opts) => {
          const thermostatMode = this.getCapabilityValue('thermostat_mode_custom');
          if (thermostatMode === 'auto' || thermostatMode === 'off') {
            throw new Error(`Target temperature can't be adjusted when the thermostat is in ${thermostatMode} mode`);
          } else {
            // let { occupancy } = await this._thermostatCluster.readAttributes(['occupancy']).catch(this.error);
            // const thermostatOccupancyState = !occupancy.occupied ? this.getCapabilityValue('thermostat_mode_custom') !== 'away' : occupancy.occupied;
            const thermostatOccupancyState = this.getCapabilityValue('thermostat_mode_custom') !== 'away';
            let payload = thermostatOccupancyState ? { occupiedHeatingSetpoint : value * 100, } : { unoccupiedHeatingSetpoint : value * 100, }
            this.log('Setting target temperature', value, payload, thermostatOccupancyState);
            return this._thermostatCluster.writeAttributes(payload)
          }

        })

    }

    /*
    thermostat_state
    1. define listener for updating received attribute thermostatRunningState
    */

    if(this.hasCapability('thermostat_state')) {
      this.zclNode.endpoints[1].clusters.thermostat.on('attr.thermostatRunningState', value => {
        this.log('attr.thermostatRunningState', value, value.heatStateOn);

        this.setCapabilityValue('thermostat_state',
          value.heatStateOn).catch(this.error)
      })
    }

    if(this.hasCapability('measure_temperature.room')) this._registerTemperatureCapability('measure_temperature.room', 'localTemperature');
    if(this.hasCapability('measure_temperature.floor')) this._registerTemperatureCapability('measure_temperature.floor', 'outdoorTemperature');


    if(this.hasCapability('thermostat_state')) {
      /*

      thermostat_mode_custom
      1. define listener thermostat_mode_custom based on systemMode
        update capability based on received report
        refreshCapabilityValue for target_temperature (occupiedHeatingSetpoint)
      2. define listener thermostat_mode_custom based on occupancy
        update capability based on received report (unoccupied > away)
        refreshCapabilityValue for target_temperature (unoccupiedHeatingSetpoint)
      2. registerCapabilityListener for thermostat_mode_custom
        if away -> set occupancy
        if not away -> set systemMode
      */

      this.registerCapability('thermostat_mode_custom', CLUSTER.THERMOSTAT, {
        get: 'systemMode',
        getOpts: {
          getOnStart: true,
        },
        report: 'systemMode',
        async reportParser(value) {

          let mode = Mode2Capability[value]

          // systemMode 'heat' is reported when in manual or in away mode
          if(value === 'heat') {
            let { awayMode } = await this._thermostatCluster.readAttributes(['awayMode']).catch(this.error);

            if (awayMode === 'awayModeActive') {
              mode = 'away';
            }
          }
          this.log('systemMode report', value, mode);
          if (mode === 'away') {
            // update the target_temperature based on the new mode
            let {unoccupiedHeatingSetpoint} = await this._thermostatCluster.readAttributes(['unoccupiedHeatingSetpoint']).catch(this.error);

            this.onTargetTemperatureAttributeReport('unoccupiedHeatingSetpoint', mode, unoccupiedHeatingSetpoint);
          } else if ( mode !== 'off') {
            // update the target_temperature based on the new mode
            let {occupiedHeatingSetpoint} = await this._thermostatCluster.readAttributes(['occupiedHeatingSetpoint']).catch(this.error);

            this.onTargetTemperatureAttributeReport('occupiedHeatingSetpoint', mode, occupiedHeatingSetpoint);
          }


          if (value === 'off') this.setCapabilityValue('target_temperature', null).catch(this.error);

          await this.driver.triggerThermostatModeChangedTo.trigger(this, null, {mode: mode});

          return mode
        },
      })

      this.registerCapabilityListener('thermostat_mode_custom', async value => {
        let currentValue = await this.getCapabilityValue('thermostat_mode_custom');
        this.log('systemMode set from', currentValue, 'to:', value);

        if (value === 'away') {
          let payload = { awayMode: 'awayModeActive'};
          await this._thermostatCluster.writeAttributes(payload);

          // update the target_temperature based on the new mode
          let {unoccupiedHeatingSetpoint} = await this._thermostatCluster.readAttributes(['unoccupiedHeatingSetpoint']).catch(this.error);

          this.driver.triggerThermostatModeChangedTo.trigger(this, null, {mode: 'away'});

          return this.onTargetTemperatureAttributeReport('unoccupiedHeatingSetpoint', value, unoccupiedHeatingSetpoint);
        }

        // If current mode is away, first disable away mode and then set the thermostat Mode
        if (currentValue === 'away' && value !== 'away') {
          let payload = { awayMode: 'awayModeInActive'};
          await this._thermostatCluster.writeAttributes(payload);
        }

        // update the target_temperature based on the new mode
        if (value !== 'off') {
          let {occupiedHeatingSetpoint} = await this._thermostatCluster.readAttributes(['occupiedHeatingSetpoint']).catch(this.error);
          this.onTargetTemperatureAttributeReport('occupiedHeatingSetpoint', value, occupiedHeatingSetpoint);
        } else {
          this.setCapabilityValue('target_temperature', null).catch(this.error);
        };

        this.driver.triggerThermostatModeChangedTo.trigger(this, null, {mode: Capability2Mode[value]});


        return this._thermostatCluster.writeAttributes({ systemMode: Capability2Mode[value],})
      })

      this._thermostatCluster.on('attr.awayMode', value => {
        this.log('attr.awayMode', value);
        if (value === 'awayModeActive') {
          this.setCapabilityValue('thermostat_mode_custom','away').catch(this.error)
        }
      })
    }

    if(this.hasCapability('alarm_current')) {
      this.registerCapability('alarm_current', CLUSTER.ELECTRICAL_MEASUREMENT, {
        get: 'rmsCurrent',
        getOpts: {
          getOnStart: true,
        },
        report: 'rmsCurrent',
        /**
         * @param {number} value
         * @returns {null|number}
         */
        reportParser(value) {
          const acCurrentFactor = 0.001;
          const currentAlarmLevel = this.getSetting('over_current_alarm_level');

          return value * acCurrentFactor > currentAlarmLevel;
        },
      })

    }

    if (this.hasCapability('measure_power')) {

      // Define electricaMeasurement cluster attribute reporting and parsing options. Do NOT await this.initElectricalMeasurementClusterAttributeReporting()
      if (!this.activePowerFactor) this.initElectricalMeasurementClusterAttributeReporting({ zclNode });


      this.registerCapability('measure_power', CLUSTER.ELECTRICAL_MEASUREMENT, {
        /*reportOpts: {
          configureAttributeReporting: {
            minInterval: 5, // No minimum reporting interval
            maxInterval: this.getSetting('reporting_interval_power') || 300, // Maximally every ~16 hours
            minChange: this.getSetting('reporting_threshold_power') || 5, // Report when value changed by 5
          },
        },*/
        endpoint: this.getClusterEndpoint(CLUSTER.ELECTRICAL_MEASUREMENT),
      });

    }

    if (this.hasCapability('meter_power')) {

      // Define Metering cluster attribute reporting and parsing options. Do NOT await this.initMeteringClusterAttributeReporting()
      if (!this.meteringFactor) this.initMeteringClusterAttributeReporting({ zclNode });

      this.registerCapability('meter_power', CLUSTER.METERING, {
        /*reportOpts: {
          configureAttributeReporting: {
            minInterval: 60, // No minimum reporting interval
            maxInterval: 3600, // Maximally every ~16 hours
            minChange: 1, // Report when value changed by 5
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
      minInterval: 5, //
      maxInterval: 300,
      minChange: 1 / this.activePowerFactor,
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

  async onSettings ({ oldSettings, newSettings, changedKeys }) {
    var attributes = {};
    for (const changedKey of changedKeys) {
      let newValue = newSettings[changedKey];
      const manifestSetting = (
          this._getManifestSettings().find(setting => setting.id === changedKey) || {}
        ).zigbee;
      if(typeof manifestSetting !== 'undefined' && !manifestSetting.hasOwnProperty('attributeReporting')) {
        if(manifestSetting.hasOwnProperty('setParser')){
          const reportParser = eval(manifestSetting.setParser);
          newValue = reportParser(newValue);
        }
        if (!attributes.hasOwnProperty(manifestSetting.cluster)) attributes[manifestSetting.cluster] = {};
        attributes[manifestSetting.cluster][manifestSetting.attribute] = newValue;
      }
    }

    if (Object.keys(attributes).length > 0) {
      this.log('To be written attrubutes', attributes);
      Object.keys(attributes).forEach( async clusterId => {
        try {
          await this.zclNode.endpoints[1].clusters[clusterId].writeAttributes(attributes[clusterId])
        } catch (err) {
          // reset settings values on failed update
          throw new Error(`failed to update settings: ${attributes[clusterId]}. Message:${err}`);
        }

      })

    }

    if (changedKeys.includes('reporting_threshold_temperature') || changedKeys.includes('reporting_interval_temperature')) {
      const temperatureInterval = newSettings['reporting_interval_temperature'] || this.getSetting('reporting_interval_temperature');
      const temperatureThreshold = 100 * (newSettings['reporting_threshold_temperature'] || this.getSetting('reporting_threshold_temperature'));
      this.log('DEBUG:', temperatureInterval, temperatureThreshold);
      await this.configureAttributeReporting([{
        cluster: CLUSTER.THERMOSTAT,
        attributeName: 'localTemperature',
        minInterval: 5,
        maxInterval: temperatureInterval,
        minChange: temperatureThreshold,
      },
      {
        cluster: CLUSTER.THERMOSTAT,
        attributeName: 'outdoorTemperature',
        minInterval: 5,
        maxInterval: temperatureInterval,
        minChange: temperatureThreshold,
      }]).catch(this.error);
    }

    if (changedKeys.includes('reporting_threshold_power') || changedKeys.includes('reporting_interval_power')) {
      const powerInterval = newSettings['reporting_interval_power'] || this.getSetting('reporting_interval_power');
      const powerThreshold = (newSettings['reporting_threshold_power'] || this.getSetting('reporting_threshold_power'));
      this.log('DEBUG:', powerInterval, powerThreshold);
      await this.configureAttributeReporting([{
        cluster: CLUSTER.ELECTRICAL_MEASUREMENT,
        attributeName: 'activePower',
        minInterval: 5,
        maxInterval: powerInterval,
        minChange: powerThreshold,
      }]).catch(this.error);
    }
  }

  onTargetTemperatureAttributeReport(attribute, thermostatMode, value) {
    this.log(`attr.${attribute} ${value}`)
    if (thermostatMode === 'report') thermostatMode = this.getCapabilityValue('thermostat_mode_custom');

    if( (attribute === 'occupiedHeatingSetpoint' && thermostatMode !== 'away') || (attribute === 'unoccupiedHeatingSetpoint' && thermostatMode === 'away')) {
      let parsedValue = thermostatMode !== 'off' ? Math.round((value / 100) * 10) / 10 : null;
      this.setCapabilityValue('target_temperature',
        parsedValue).catch(this.error)
    }
  }

  _registerTemperatureCapability(registerCapability, registerAttribute) {
    this.registerCapability(registerCapability, CLUSTER.THERMOSTAT, {
      get: registerAttribute,
      getOpts: {
        getOnStart: true,
      },
      report: registerAttribute,
      reportParser (value) {
        if (value > -20) {
          let parsedValue = Math.round((value / 100) * 10) / 10;

          const controlledSensor = this.getSetting('thermostat_control_mode') === 2 ? 'measure_temperature.floor' : 'measure_temperature.room';
          const temperatureAlarmLevel = this.getSetting('temperature_alarm_level');

          if(controlledSensor === registerCapability) {
            this.setCapabilityValue('alarm_heat', parsedValue > temperatureAlarmLevel);
            this.setCapabilityValue('measure_temperature', parsedValue).catch(this.error);
          };

          return parsedValue
        }
        return null;
      },
      reportOpts: {
        configureAttributeReporting: {
          minInterval: 10, // Minimally once 10 seconds
          maxInterval: this.getSetting('reporting_interval_temperature') || 300, // Maximally once 15 min
          minChange: 100*this.getSetting('reporting_threshold_temperature') || 20,
        },
      },
    })

  }

  /**
  * Method that registers the attributeReportListeners for all settings with zigbee object in the manifestSetting
  * @returns {any[]}
  */
  _registerSettingsListeners() {
    const manifestSettings = this._getManifestSettings();
    Object.keys(manifestSettings).forEach( async settingId => {
      const manifestSetting = manifestSettings[settingId];
      if (manifestSetting.zigbee) {

      if (!manifestSetting.zigbee.hasOwnProperty('attributeReporting') && manifestSetting.zigbee.attribute) {
          this.zclNode.endpoints[`${manifestSetting.zigbee.endpoint}`].clusters[`${manifestSetting.zigbee.cluster}`].on(`attr.${manifestSetting.zigbee.attribute}`, async value => {

            let parsedValue = value;
            if(manifestSetting.zigbee.hasOwnProperty('reportParser')) {
              const reportParser = eval(manifestSetting.zigbee.reportParser);
              parsedValue = reportParser(value);
            }

            try {
              const attributes = { [manifestSetting.id]: parsedValue};
              this.log(`attr.${manifestSetting.zigbee.attribute} ${manifestSetting.id}`, value, parsedValue, typeof parsedValue, attributes);

              await this.setSettings(attributes);
            } catch (err) {
              this.error(`failed_to_set_${manifestSetting.id}_to_${value}`, err);
            }
          })
        }
      }
    })
  }

  /**
  * Method that flattens possibly nested settings and returns a flat settings array.
  * @returns {any[]}
  */
 _getManifestSettings() {
   if (!this.manifestSettings) {
     const { manifest } = this.driver;
     if (!manifest || !manifest.settings) {
       this.manifestSettings = [];
       return this.manifestSettings;
     }

     const flattenSettings = settings => settings.reduce((manifestSettings, setting) => {
       if (setting.type === 'group') {
         return manifestSettings.concat(flattenSettings(setting.children));
       }
       manifestSettings.push(setting);
       return manifestSettings;
     }, []);

     this.manifestSettings = flattenSettings(manifest.settings);
   }
   return this.manifestSettings;
 }

  /**
  * Get a specific setting object from the manifest
  * @param {string} id - Setting id to retrieve
  * @returns {object|Error}
  */
 _getManifestSetting(id) {
   const settings = this._getManifestSettings();
   if (Array.isArray(settings)) return settings.find(setting => setting.id === id);
   return new Error(`missing_setting_id_${id}`);
 }

}

module.exports = ZBThermostatDevice

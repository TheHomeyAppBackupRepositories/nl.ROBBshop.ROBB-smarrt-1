'use strict'

// disable voltage reporting: parameter 20, size 1, 0
// disable voltage reporting: parameter 19, size 1, 0
const { ZwaveDevice } = require('homey-zwavedriver')

const Capability2SetpointType = {
  manual: 'Heating 1',
  auto: 'Energy Save Heating',
  dry: 'Dry Air',
  off: 'Heating 1',
  away: 'Away Heating',
}

const Capability2Mode = {
  manual: 'Heat',
  auto: 'Energy Save Heat',
  dry: 'Dry Air',
  off: 'Off',
  away: 'AWAY',
}

const Mode2Capability = {
  'Heat': 'manual',
  'Energy Save Heat': 'auto',
  'Dry Air': 'dry',
  'Off': 'off',
  'AWAY': 'away',
}

class ZWThermostatDevice extends ZwaveDevice {

  async onNodeInit ({ node }) {

    // this.enableDebug()
    // this.printNode()
    if (!this.hasCapability('button.reset_meter')) this.addCapability('button.reset_meter');

    if (this.hasCapability('measure_power')) this.registerCapability('measure_power', 'METER')
    if (this.hasCapability('meter_power')) this.registerCapability('meter_power', 'METER')
    if (this.hasCapability('alarm_heat')) this.registerCapability('alarm_heat', 'NOTIFICATION', {getOpts: {getOnStart: true,},})

    /*
    let manifestSettings = this.getManifestSettings();
    Object.keys(manifestSettings).forEach(async settingId => {
      this.log('DEBUG', manifestSettings[settingId].id, manifestSettings[settingId].zwave.index);
      await this.configurationGet({ index: manifestSettings[settingId].zwave.index,});
    })
    */

    if (this.hasCapability('alarm_current')) this.registerCapability('alarm_current', 'NOTIFICATION', {
      get: 'NOTIFICATION_GET',
      getParser: () => ({
        'V1 Alarm Type': 0,
        'Notification Type': 'Power Management',
        Event: 2,
      }),
      getOpts: {
        getOnStart: true,
      },
      report: 'NOTIFICATION_REPORT',
      reportParser: report => {

        if (
          report
          && report['Notification Type'] === 'Power Management'
          && report.hasOwnProperty('Event (Parsed)')
        ) {
          if (
            report['Event (Parsed)'] === 'Over-current detected'
          ) {
            return true;
          }

          if (
            report['Event (Parsed)'] === 'Event inactive'
            && (!report.hasOwnProperty('Event Parameter')
            || typeof report['Event Parameter'][0] === 'undefined'
            || report['Event Parameter'][0] === 1
            || report['Event Parameter'][0] === 2
            || report['Event Parameter'][0] === 3
            || report['Event Parameter'][0] === 4
            || report['Event Parameter'][0] === 7)
          ) {
            return false;
          }
        }
        return null;
      },
    });

    this.registerCapability('target_temperature', 'THERMOSTAT_SETPOINT')

    this._registerTemperatureCapability('measure_temperature.room', 1);
    this._registerTemperatureCapability('measure_temperature.floor', 2);

    this.registerCapability('thermostat_mode_custom', 'THERMOSTAT_MODE', {
      get: 'THERMOSTAT_MODE_GET',
      getOpts: {
        getOnStart: true,
      },
      set: 'THERMOSTAT_MODE_SET',
      setParser: (value) => {

        this.log('THERMOSTAT_MODE_SET ', value)
        if (!Capability2Mode.hasOwnProperty(value)) {
          return null
        }
        const mode = Capability2Mode[value]
        if (typeof mode !== 'string') {
          return null
        }

        if (Capability2SetpointType.hasOwnProperty(value)) {

          this.thermostatSetpointType = Capability2SetpointType[value]

          //clearTimeout(this.refreshTargetTemperatureTimeout)
          //this.refreshTargetTemperatureTimeout = this.homey.setTimeout(() => {

          //  this.log('Refresh Capability Value')
          this.refreshCapabilityValue('target_temperature', 'THERMOSTAT_SETPOINT').catch(this.error)
          //}, 1000)
        }
        this.driver.triggerThermostatModeChangedTo.trigger(this, null, {mode: value});

        this.log('Set THERMOSTAT_MODE_SET | switching mode to:', value);
        return {
          'Level': {
            'No of Manufacturer Data fields': 0,
            'Mode': mode,
          },
          'Manufacturer Data': Buffer.from([]),
        }
      },
      report: 'THERMOSTAT_MODE_REPORT',
      reportParser: report => {
        if (report
          && report.hasOwnProperty('Level')
          && report['Level'].hasOwnProperty('Mode')) {

          const mode = report['Level']['Mode']
          if (typeof mode === 'string' &&
            Mode2Capability.hasOwnProperty(mode)) {

            const capabilityMode = Mode2Capability[mode]

            if (Capability2SetpointType.hasOwnProperty(
              capabilityMode)) {

              this.thermostatSetpointType = Capability2SetpointType[capabilityMode]

              // clearTimeout(this.refreshTargetTemperatureTimeout)
              // this.refreshTargetTemperatureTimeout = this.homey.setTimeout(() => {

                this.refreshCapabilityValue('target_temperature', 'THERMOSTAT_SETPOINT').catch(this.error)
              // }, 1000)
            }
            this.driver.triggerThermostatModeChangedTo.trigger(this, null, {mode: capabilityMode});
            this.log('Received THERMOSTAT_MODE_REPORT | switching mode to:', capabilityMode);
            return capabilityMode
          }
        }

        return null
      },
    })

    this.registerCapability('thermostat_state', 'THERMOSTAT_OPERATING_STATE', {
      getOpts: {
        getOnStart: true,
      },
      get: 'THERMOSTAT_OPERATING_STATE_GET',
      report: 'THERMOSTAT_OPERATING_STATE_REPORT',
      reportParser: report => {
        if (report && report.hasOwnProperty('Level') && report.Level.hasOwnProperty('Operating State')) {
          let parsedValue = report.Level['Operating State'] === 'Heating';
          this.log('Received THERMOSTAT_OPERATING_STATE_REPORT | switching state to:', parsedValue);
          return parsedValue;
        }
        return null;
      },
    });

    if (this.hasCapability('button.reset_meter')) {
      // Listen for reset_meter maintenance action
      this.registerCapabilityListener('button.reset_meter', async () => {
        // Maintenance action button was pressed, return a promise
        if (typeof this.meterReset === 'function') return this.meterReset({multiChannelNodeId: 1});
        this.error('Reset meter failed');
        throw new Error('Reset meter not supported');
      });
    }

    // register a settings parser
    this.registerSetting('calibration_room_sensor', value => Buffer.from([value*10]));
    this.registerSetting('calibration_floor_sensor', value => Buffer.from([value*10]));
    this.registerSetting('temperature_control_hysteresis', value => Buffer.from([value*10]));
    this.registerSetting('reporting_threshold_temperature', value => Buffer.from([value*10]));
    this.registerSetting('over_current_alarm_level', value => Buffer.from([value < 5 ? 0 : value]));
    this.registerSetting('open_window_detection', value => Buffer.from([value < 1.5 ? 0 : value*10]));
  }

  _registerTemperatureCapability(registerCapability, multiChannelNodeId) {
    this.registerCapability(registerCapability, 'SENSOR_MULTILEVEL', {
      reportParser: report => {
        if (
          report
          && report.hasOwnProperty('Sensor Type')
          && report['Sensor Type'] === 'Temperature (version 1)'
          && report.hasOwnProperty('Sensor Value (Parsed)')
          && report.hasOwnProperty('Level')
          && report.Level.hasOwnProperty('Scale')
        ) {
          let parsedValue = null;
          // Some devices send this when no temperature sensor is connected
          if (report['Sensor Value (Parsed)'] === -999.9) parsedValue = null;
          if (report.Level.Scale === 0) parsedValue = report['Sensor Value (Parsed)'];
          if (report.Level.Scale === 1) parsedValue = (report['Sensor Value (Parsed)'] - 32) / 1.8;

          const controlledSensor = this.getSetting('thermostat_control_mode') === 2 ? 'measure_temperature.floor' : 'measure_temperature.room';
          if(controlledSensor === registerCapability) this.setCapabilityValue('measure_temperature', parsedValue).catch(this.error);

          return parsedValue
        }
        return null;
      },
      multiChannelNodeId: multiChannelNodeId })
  }

}

module.exports = ZWThermostatDevice

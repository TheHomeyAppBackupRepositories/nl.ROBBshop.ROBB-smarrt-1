'use strict';

const Homey = require('homey');
const { ZwaveDevice } = require('homey-zwavedriver');

module.exports = class ZW_MotionSensor extends ZwaveDevice {

  async onNodeInit({ node }) {
    // Mark device as unavailable while configuring
    this.setUnavailable(this.homey.__('pairing.configuring')).catch(this.error);

    // enable debugging
    // this.enableDebug();

    // print the node's info to the console
    // this.printNode();

    this.registerCapability('measure_battery', 'BATTERY');

    this.registerCapability('measure_temperature', 'SENSOR_MULTILEVEL');
    this.registerCapability('measure_humidity', 'SENSOR_MULTILEVEL');
    this.registerCapability('measure_luminance', 'SENSOR_MULTILEVEL');
    this.registerCapability('alarm_motion', 'NOTIFICATION');

    // register a settings parser
    this.registerSetting('motion_sensor_blindtime', value => new Buffer([(value / 0.5) - 1]));
    this.registerSetting('basic_on_command', value => new Buffer([value > 100 ? 255 : value]));
    this.registerSetting('basic_off_command', value => new Buffer([value > 100 ? 255 : value]));
    this.registerSetting('reporting_threshold_temperature', value => value * 10);
    this.registerSetting('sensor_compensation_temperature', value => new Buffer([value * 10]));

    // Finally device is ready to be used, mark as available
    this.setAvailable().catch(this.error);
  }

};

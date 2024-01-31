'use strict';

const Homey = require('homey');
const { debug, CLUSTER } = require('zigbee-clusters');
const ZBSwitchDevice = require('../../lib/ZBSwitchDevice');

module.exports = class ZB_WallPlugTemperature extends ZBSwitchDevice {

  async onNodeInit({ zclNode }) {
    // Mark device as unavailable while configuring
    this.setUnavailable(this.homey.__('pairing.configuring')).catch(this.error);

    // Enables debug logging in zigbee-clusters
    // debug(true);

    // enable debugging
    // this.enableDebug();

    // print the node's info to the console
    // this.printNode();

    this.endpointIds = {
      firstOutlet: 1,
    };

    await super.onNodeInit({ zclNode });

    if (this.hasCapability('measure_temperature')) {
      this.registerCapability('measure_temperature', CLUSTER.TEMPERATURE_MEASUREMENT, {
        get: 'measuredValue',
        report: 'measuredValue',
        reportOpts: {
          configureAttributeReporting: {
            minInterval: 1, // No minimum reporting interval
            maxInterval: 60, // Maximally every ~16 hours
            minChange: 100, // Report when value changed by 5
          },
        },
        reportParser(value) {
          // MeasuredValue represents the temperature in degrees Celsius as follows:
          // MeasuredValue = 100 x temperature in degrees Celsius.
          return Math.round((value / 100) * 10) / 10;
        },
        endpoint: 1,
      });
    }

    // Finally device is ready to be used, mark as available
    this.setAvailable().catch(this.error);
  }

};

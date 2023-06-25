'use strict';

const Homey = require('homey');
const ZWSwitchDevice = require('../../lib/ZWSwitchDevice');

module.exports = class ZW_WallPlug extends ZWSwitchDevice {

  async onNodeInit({ node }) {
    // Mark device as unavailable while configuring
    this.setUnavailable(this.homey.__('pairing.configuring')).catch(this.error);

    // enable debugging
    // this.enableDebug();

    // print the node's info to the console
    // this.printNode();

    await super.onNodeInit({ node });

    // register a settings parser
    this.registerSetting('report_interval_power', value => ((value < 60 && value !== 0) ? 60 : value));
    this.registerSetting('report_interval_energy', value => ((value < 60 && value !== 0) ? 60 : value));

    // Finally device is ready to be used, mark as available
    this.setAvailable().catch(this.error);
  }

};

'use strict';

const Homey = require('homey');
const ZWSwitchDevice = require('../../lib/ZWSwitchDevice');

module.exports = class ZW_Switch extends ZWSwitchDevice {

  async onNodeInit({ node }) {
    // Mark device as unavailable while configuring
    this.setUnavailable(this.homey.__('pairing.configuring')).catch(this.error);

    // enable debugging
    // this.enableDebug();

    // print the node's info to the console
    // this.printNode();

    await super.onNodeInit({ node });

    // Finally device is ready to be used, mark as available
    this.setAvailable().catch(this.error);
  }

};

'use strict';

const Homey = require('homey');
const ZWWallControllerDevice = require('../../lib/ZWWallControllerDevice');

module.exports = class ZW_WallController_2 extends ZWWallControllerDevice {

  async onNodeInit({ node }) {
    // Mark device as unavailable while configuring
    this.setUnavailable(this.homey.__('pairing.configuring')).catch(this.error);

    // enable debugging
    // this.enableDebug();

    // print the node's info to the console
    // this.printNode();

    // supported scenes and their reported attribute numbers (all based on reported data)
    this.buttonMap = {
      1: 'Group2-I',
      2: 'Group2-O',
    };

    this.sceneMap = {
      'Key Pressed 1 time': 'Key Pressed 1 time',
      'Key Held Down': 'Key Held Down',
      'Key Released': 'Key Released',
    };

    await super.onNodeInit({ node });

    // Finally device is ready to be used, mark as available
    this.setAvailable().catch(this.error);
  }

};

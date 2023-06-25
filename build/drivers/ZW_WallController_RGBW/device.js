'use strict';

const Homey = require('homey');
const ZWWallControllerDevice = require('../../lib/ZWWallControllerDevice');

const lastKey = null;

module.exports = class ZW_WallController_RGBW extends ZWWallControllerDevice {

  async onNodeInit({ node }) {
    // Mark device as unavailable while configuring
    this.setUnavailable(this.homey.__('pairing.configuring')).catch(this.error);

    // enable debugging
    // this.enableDebug();

    // print the node's info to the console
    // this.printNode();

    // supported scenes and their reported attribute numbers (all based on reported data)
    this.buttonMap = {
      1: 'Group2-Power',
      2: 'Group2-Brightness',
      3: 'Group3-White',
      4: 'Group3-RGB',

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

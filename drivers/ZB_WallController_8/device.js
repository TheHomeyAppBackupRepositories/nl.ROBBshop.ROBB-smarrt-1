'use strict';

const ZBWallControllerDevice = require('../../lib/ZBWallControllerDevice');

module.exports = class ZB_WallController_8 extends ZBWallControllerDevice {

  async onNodeInit({ zclNode }) {
    // Mark device as unavailable while configuring
    this.setUnavailable(this.homey.__('pairing.configuring')).catch(this.error);

    // enable debugging
    // this.enableDebug();

    // print the node's info to the console
    // this.printNode();

    // supported scenes and their reported attribute numbers (all based on reported data)
    this.buttonMap = {
      1: 'Group1',
      2: 'Group2',
      3: 'Group3',
      4: 'Group4',
    };

    this.sceneMap = {
      on: 'Switched ON',
      off: 'Switched OFF',
      moveWithOnOff_move_up: 'Dimming UP',
      moveWithOnOff_move_down: 'Dimming DOWN',
      stopWithOnOff: 'Dimming STOP',
    };

    await super.onNodeInit({ zclNode });

    // Finally device is ready to be used, mark as available
    this.setAvailable().catch(this.error);
  }

};

/*

*/

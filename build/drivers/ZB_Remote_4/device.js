'use strict';

const ZBWallControllerDevice = require('../../lib/ZBWallControllerDevice');
const { CLUSTER } = require('zigbee-clusters');
const ROBBSpecificScenesCluster = require('../../lib/Clusters/ROBBSpecificScenesCluster');
const ScenesBoundCluster = require('../../lib/Clusters/ScenesBoundCluster');

module.exports = class ZB_Remote_4 extends ZBWallControllerDevice {

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
      5: 'Scene-1',
      6: 'Scene-2'
    };

    this.sceneMap = {
      on: 'Switched ON',
      off: 'Switched OFF',
      moveWithOnOff_move_up: 'Dimming UP',
      moveWithOnOff_move_down: 'Dimming DOWN',
      stopWithOnOff: 'Dimming STOP',
      keyPressedOneTime: 'Key Pressed 1 time',
    };

    await super.onNodeInit({ zclNode });

    // Bind long press on/off button commands
    zclNode.endpoints[4].bind(ROBBSpecificScenesCluster.NAME, new ScenesBoundCluster({
      onRecallScene: this._commandHandler.bind(this, 'scene', 4),
    }));

    // Finally device is ready to be used, mark as available
    this.setAvailable().catch(this.error);
  }

  _commandHandlerScenes(command, endpoint, payload) {
    this.log('scene activation:', command, endpoint, payload.sceneID);
    this._commandHandler(command, endpoint, payload);
  };

};

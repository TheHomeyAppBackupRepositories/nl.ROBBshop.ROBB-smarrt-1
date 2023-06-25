'use strict';

const ZBWallControllerDevice = require('../../lib/ZBWallControllerDevice');

module.exports = class ZB_WallController_2 extends ZBWallControllerDevice {

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
2019-11-30 10:47:55 [log] [ManagerDrivers] [ZB_WallController_2] [0] ZigBeeDevice has been inited
2019-11-30 10:47:55 [log] [ManagerDrivers] [ZB_WallController_2] [0] ------------------------------------------
2019-11-30 10:47:55 [log] [ManagerDrivers] [ZB_WallController_2] [0] Node: fd21de3e-fcec-4026-95a1-7b30b547096a
2019-11-30 10:47:55 [log] [ManagerDrivers] [ZB_WallController_2] [0] - Battery: true
2019-11-30 10:47:55 [log] [ManagerDrivers] [ZB_WallController_2] [0] - Endpoints: 0
2019-11-30 10:47:55 [log] [ManagerDrivers] [ZB_WallController_2] [0] -- Clusters:
2019-11-30 10:47:55 [log] [ManagerDrivers] [ZB_WallController_2] [0] --- zapp
2019-11-30 10:47:55 [log] [ManagerDrivers] [ZB_WallController_2] [0] --- genBasic
2019-11-30 10:47:55 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- 9 : 255
2019-11-30 10:47:55 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- 10 : 00
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- 11 : NULL
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- 30721 : 3
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- 30722 : 255
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- 30723 : 255
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- 30724 : 255
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- 65533 : 1
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- cid : genBasic
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- sid : attrs
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- zclVersion : 2
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- appVersion : 0
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- stackVersion : 0
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- hwVersion : 0
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- manufacturerName : Sunricher
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- modelId : ZGRC-KEY-007
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- dateCode : NULL
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- powerSource : 3
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- appProfileVersion : 255
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- swBuildId : 2.2.3_r11
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] --- genPowerCfg
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- 65533 : 1
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- cid : genPowerCfg
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- sid : attrs
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- batteryVoltage : 30
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- batteryPercentageRemaining : 99
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- batterySize : 255
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- batteryQuantity : 0
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- batteryVoltMinThres : 0
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- batteryVoltThres1 : 0
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- batteryVoltThres2 : 0
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- batteryVoltThres3 : 0
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- batteryAlarmState : 0
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] --- genIdentify
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- 65533 : 1
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- cid : genIdentify
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- sid : attrs
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- identifyTime : 0
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] --- genGroups
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- cid : genGroups
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- sid : attrs
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] --- genOnOff
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- cid : genOnOff
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- sid : attrs
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] --- genLevelCtrl
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- cid : genLevelCtrl
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- sid : attrs
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] --- genOta
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- cid : genOta
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- sid : attrs
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] --- haDiagnostic
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- 65533 : 1
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- cid : haDiagnostic
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- sid : attrs
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- numberOfResets : 0
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- averageMacRetryPerApsMessageSent : 0
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- lastMessageLqi : 254
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- lastMessageRssi : -64
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] --- lightLink
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- 65533 : 1
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- cid : lightLink
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ---- sid : attrs
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_2] [0] ------------------------------------------

*/

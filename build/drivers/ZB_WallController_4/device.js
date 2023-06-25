'use strict';

const ZBWallControllerDevice = require('../../lib/ZBWallControllerDevice');

module.exports = class ZB_WallController_4 extends ZBWallControllerDevice {

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
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ------------------------------------------
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] Node: adc91963-da38-4dd3-a134-19a4b373a30b
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] - Battery: true
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] - Endpoints: 0
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] -- Clusters:
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] --- zapp
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] --- genBasic
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- 9 : 255
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- 10 : 00
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- 11 : NULL
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- 30721 : 6
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- 30722 : 255
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- 30723 : 255
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- 30724 : 255
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- 65533 : 1
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- cid : genBasic
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- sid : attrs
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- zclVersion : 2
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- appVersion : 0
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- stackVersion : 0
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- hwVersion : 0
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- manufacturerName : Sunricher
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- modelId : ZG2833K4_EU06
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- dateCode : NULL
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- powerSource : 3
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- appProfileVersion : 255
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- swBuildId : 2.2.3_r11
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] --- genPowerCfg
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- 65533 : 1
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- cid : genPowerCfg
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- sid : attrs
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- batteryVoltage : 28
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- batteryPercentageRemaining : 76
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- batterySize : 255
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- batteryQuantity : 0
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- batteryVoltMinThres : 0
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- batteryVoltThres1 : 0
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- batteryVoltThres2 : 0
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- batteryVoltThres3 : 0
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- batteryAlarmState : 0
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] --- genIdentify
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- 65533 : 1
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- cid : genIdentify
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- sid : attrs
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- identifyTime : 0
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] --- genGroups
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- cid : genGroups
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- sid : attrs
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] --- genScenes
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- cid : genScenes
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- sid : attrs
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] --- genOnOff
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- cid : genOnOff
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- sid : attrs
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] --- genLevelCtrl
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- cid : genLevelCtrl
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- sid : attrs
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] --- genOta
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- cid : genOta
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- sid : attrs
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] --- haDiagnostic
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- 65533 : 1
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- cid : haDiagnostic
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- sid : attrs
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- numberOfResets : 0
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- averageMacRetryPerApsMessageSent : 3
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- lastMessageLqi : 254
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- lastMessageRssi : -50
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] --- lightLink
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- 65533 : 1
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- cid : lightLink
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- sid : attrs
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] - Endpoints: 1
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] -- Clusters:
2019-11-30 10:47:56 [log] [ManagerDrivers] [ZB_WallController_4] [0] --- zapp
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] --- genBasic
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- 9 : 255
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- 10 : 00
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- 11 : NULL
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- 30721 : 6
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- 30722 : 255
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- 30723 : 255
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- 30724 : 255
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- 65533 : 1
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- cid : genBasic
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- sid : attrs
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- zclVersion : 2
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- appVersion : 0
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- stackVersion : 0
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- hwVersion : 0
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- manufacturerName : Sunricher
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- modelId : ZG2833K4_EU06
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- dateCode : NULL
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- powerSource : 3
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- appProfileVersion : 255
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- swBuildId : 2.2.3_r11
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] --- genPowerCfg
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- 65533 : 1
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- cid : genPowerCfg
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- sid : attrs
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- batteryVoltage : 28
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- batteryPercentageRemaining : 76
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- batterySize : 255
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- batteryQuantity : 0
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- batteryVoltMinThres : 0
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- batteryVoltThres1 : 0
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- batteryVoltThres2 : 0
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- batteryVoltThres3 : 0
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- batteryAlarmState : 0
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] --- genIdentify
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- 65533 : 1
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- cid : genIdentify
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- sid : attrs
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- identifyTime : 0
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] --- genGroups
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- cid : genGroups
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- sid : attrs
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] --- genScenes
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- cid : genScenes
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- sid : attrs
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] --- genOnOff
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- cid : genOnOff
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- sid : attrs
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] --- genLevelCtrl
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- cid : genLevelCtrl
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- sid : attrs
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] --- genOta
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- cid : genOta
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- sid : attrs
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] --- haDiagnostic
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- 65533 : 1
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- cid : haDiagnostic
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- sid : attrs
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- numberOfResets : 0
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- averageMacRetryPerApsMessageSent : 0
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- lastMessageLqi : 0
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- lastMessageRssi : 0
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] --- lightLink
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- 65533 : 1
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- cid : lightLink
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ---- sid : attrs
2019-11-30 10:47:57 [log] [ManagerDrivers] [ZB_WallController_4] [0] ------------------------------------------

*/

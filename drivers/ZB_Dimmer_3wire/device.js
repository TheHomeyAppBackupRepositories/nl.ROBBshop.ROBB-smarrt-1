'use strict';

const ZBDimmerDevice = require('../../lib/ZBDimmerDevice');

module.exports = class ZB_Dimmer3wire extends ZBDimmerDevice {

  async onNodeInit({ zclNode }) {
    // Mark device as unavailable while configuring
    this.setUnavailable(this.homey.__('pairing.configuring')).catch(this.error);

    // enable debugging
    // this.enableDebug();

    // print the node's info to the console
    // this.printNode();

    await super.onNodeInit({ zclNode });

    // Finally device is ready to be used, mark as available
    this.setAvailable().catch(this.error);
  }

};

/*
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ------------------------------------------
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] Node: 62955f2f-f2bb-4b8f-af44-e57f5b61b157
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] - Battery: false
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] - Endpoints: 0
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] -- Clusters:
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] --- zapp
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] --- genBasic
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- 9 : 255
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- 10 : 00
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- 11 : NULL
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- 30721 : 255
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- 30722 : 255
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- 30723 : 255
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- 30724 : 255
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- 34819 : 0
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- 34820 : 0
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- 36864 : 2
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- 65533 : 1
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- cid : genBasic
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- sid : attrs
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- zclVersion : 3
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- appVersion : 0
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- stackVersion : 0
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- hwVersion : 0
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- manufacturerName : Sunricher
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- modelId : ZG9101SAC-HP
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- dateCode : NULL
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- powerSource : 1
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- appProfileVersion : 255
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- swBuildId : 2.4.1_r30
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] --- genIdentify
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- 65533 : 1
2019-11-30 10:47:58 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- cid : genIdentify
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- sid : attrs
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- identifyTime : 0
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] --- genGroups
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- 65533 : 1
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- cid : genGroups
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- sid : attrs
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- nameSupport : 0
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] --- genScenes
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- 65533 : 1
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- cid : genScenes
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- sid : attrs
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- count : 0
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- currentScene : 0
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- currentGroup : 0
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- sceneValid : 0
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- nameSupport : 0
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] --- genOnOff
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- 65533 : 1
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- cid : genOnOff
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- sid : attrs
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- onOff : 0
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- globalSceneCtrl : 1
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- onTime : 0
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- offWaitTime : 0
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] --- genLevelCtrl
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- 15 : 1
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- 16384 : 255
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- 65533 : 1
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- cid : genLevelCtrl
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- sid : attrs
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- currentLevel : 254
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- remainingTime : 0
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- onOffTransitionTime : 1
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- onLevel : 255
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] --- genOta
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- cid : genOta
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- sid : attrs
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] --- haDiagnostic
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- 65533 : 1
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- cid : haDiagnostic
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- sid : attrs
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- numberOfResets : 0
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- averageMacRetryPerApsMessageSent : 0
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- lastMessageLqi : 0
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- lastMessageRssi : 0
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] --- lightLink
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- 65533 : 1
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- cid : lightLink
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- sid : attrs
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] - Endpoints: 1
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] -- Clusters:
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] --- zapp
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] --- genGreenPowerProxy
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- cid : genGreenPowerProxy
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ---- sid : attrs
2019-11-30 10:47:59 [log] [ManagerDrivers] [ZB_Dimmer_3wire] [0] ------------------------------------------
*/

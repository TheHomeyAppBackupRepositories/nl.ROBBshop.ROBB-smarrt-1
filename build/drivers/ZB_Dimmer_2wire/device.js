'use strict';

const ZBDimmerDevice = require('../../lib/ZBDimmerDevice');

module.exports = class ZB_Dimmer2wire extends ZBDimmerDevice {

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
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ------------------------------------------
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] Node: 7a4d3e10-aa77-4d75-b9b1-a665d88a320b
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] - Battery: false
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] - Endpoints: 0
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] -- Clusters:
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] --- zapp
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] --- genBasic
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 9 : 255
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 10 : 00
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 11 : NULL
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 16389 : 0
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 30721 : 49246
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 30722 : 528
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 30723 : 255
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 30724 : 2
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 30725 : 0
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 34816 : 0
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 34817 : 100
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 34818 : 0
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 34819 : 0
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 34820 : 1
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 34821 : 2
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 34822 : 0
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- cid : genBasic
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- sid : attrs
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- zclVersion : 3
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- appVersion : 0
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- stackVersion : 0
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- hwVersion : 0
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- manufacturerName : Sunricher
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- modelId : Micro Smart Dimmer
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- dateCode : NULL
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- powerSource : 1
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- appProfileVersion : 255
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- swBuildId : 2.5.3_r40
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] --- genIdentify
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 65533 : 1
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- cid : genIdentify
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- sid : attrs
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- identifyTime : 0
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] --- genGroups
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 65533 : 1
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- cid : genGroups
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- sid : attrs
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- nameSupport : 0
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] --- genScenes
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 65533 : 1
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- cid : genScenes
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- sid : attrs
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- count : 0
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- currentScene : 0
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- currentGroup : 0
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- sceneValid : 0
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- nameSupport : 0
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] --- genOnOff
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 16387 : 255
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 30726 : 1
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 65533 : 1
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- cid : genOnOff
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- sid : attrs
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- onOff : 1
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- globalSceneCtrl : 1
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- onTime : 0
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- offWaitTime : 0
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] --- genLevelCtrl
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 15 : 1
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 16384 : 255
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 41728 : 254
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 65533 : 1
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- cid : genLevelCtrl
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- sid : attrs
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- currentLevel : 254
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- remainingTime : 0
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- onOffTransitionTime : 1
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- onLevel : 255
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] --- genOta
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- cid : genOta
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- sid : attrs
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] --- seMetering
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 65533 : 1
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- cid : seMetering
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- sid : attrs
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- currentSummDelivered : [ 0, 5721728 ]
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- powerFactor : 100
2019-12-15 22:17:41 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- status : 0
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- hoursInOperation : 6
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- unitOfMeasure : 0
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- multiplier : 1
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- divisor : 3600000
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- summaFormatting : 51
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- meteringDeviceType : 0
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- curPartProfileIntStartTimeDelivered : 0
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- curPartProfileIntValueDelivered : 0
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] --- haElectricalMeasurement
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 15872 : 0
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 15873 : 0
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 15874 : 0
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 15875 : 0
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 65533 : 1
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- cid : haElectricalMeasurement
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- sid : attrs
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- measurementType : 65545
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- rmsVoltage : 2385
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- rmsCurrent : 136
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- activePower : 324
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- acVoltageMultiplier : 1
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- acVoltageDivisor : 10
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- acCurrentMultiplier : 1
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- acCurrentDivisor : 1000
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- acPowerMultiplier : 1
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- acPowerDivisor : 10
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- acAlarmsMask : 7
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- acVoltageOverload : 260
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- acCurrentOverload : 16
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- acActivePowerOverload : 4000
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] --- haDiagnostic
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 65533 : 1
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- cid : haDiagnostic
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- sid : attrs
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- numberOfResets : 0
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- averageMacRetryPerApsMessageSent : 0
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- lastMessageLqi : 0
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- lastMessageRssi : 0
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] --- lightLink
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 65533 : 1
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- cid : lightLink
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- sid : attrs
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] - Endpoints: 1
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] -- Clusters:
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] --- zapp
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] --- genGreenPowerProxy
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 0 : 20
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 1 :
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 2 : 1
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 3 : 3
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 4 : 180
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 5 : 1
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 6 : 1027631
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 7 : 16777215
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 32 : 3
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 33 : [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 34 : [ 90, 105, 103, 66, 101, 101, 65, 108, 108, 105, 97, 110, 99, 101, 48, 57 ]
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- 65533 : 2
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- cid : genGreenPowerProxy
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ---- sid : attrs
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] ------------------------------------------
2019-12-15 22:17:42 [log] [ManagerDrivers] [ZB_Dimmer_2wire] [0] GreenPowerProxy endpoint:  1

*/

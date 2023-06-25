'use strict';

const ZBDimmerDevice = require('../../lib/ZBDimmerDevice');

module.exports = class ZB_LEDdimmer_RGBW extends ZBDimmerDevice {

    async onNodeInit({ zclNode }) {
      const { manifest } = this.driver;
      await this.setSettings({ zb_endpoint_descriptors: manifest.zigbee.endpoints });

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
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ------------------------------------------
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] Node: 460f7172-a3ac-4b49-885c-ca8659f6e2eb
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] - Battery: false
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] - Endpoints: 0
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] -- Clusters:
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] --- zapp
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] --- genBasic
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 9 : 255
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 10 : 00
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 11 : NULL
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 16389 : 0
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 30721 : 49246
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 30722 : 528
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 30723 : 255
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 30724 : 255
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 36864 : 2
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 36865 : 1000
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 65533 : 1
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- cid : genBasic
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- sid : attrs
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- zclVersion : 3
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- appVersion : 0
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- stackVersion : 0
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- hwVersion : 0
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- manufacturerName : Sunricher
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- modelId : RGBW-CCT
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- dateCode : NULL
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- powerSource : 1
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- appProfileVersion : 255
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- swBuildId : 2.4.1_r33
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] --- genIdentify
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 65533 : 1
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- cid : genIdentify
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- sid : attrs
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- identifyTime : 0
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] --- genGroups
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 65533 : 1
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- cid : genGroups
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- sid : attrs
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- nameSupport : 0
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] --- genScenes
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 65533 : 1
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- cid : genScenes
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- sid : attrs
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- count : 0
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- currentScene : 0
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- currentGroup : 0
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- sceneValid : 0
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- nameSupport : 0
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] --- genOnOff
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 16387 : 255
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 65533 : 1
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- cid : genOnOff
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- sid : attrs
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- onOff : 1
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- globalSceneCtrl : 1
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- onTime : 0
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- offWaitTime : 0
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] --- genLevelCtrl
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 15 : 1
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 16384 : 255
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 65533 : 1
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- cid : genLevelCtrl
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- sid : attrs
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- currentLevel : 254
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- remainingTime : 0
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- onOffTransitionTime : 1
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- onLevel : 255
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] --- genOta
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- cid : genOta
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- sid : attrs
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] --- lightingColorCtrl
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 15 : 1
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 16397 : 200
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 16400 : 65535
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 28673 : 65535
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 28674 : 65535
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 65533 : 1
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- cid : lightingColorCtrl
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- sid : attrs
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- currentHue : 0
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- currentSaturation : 254
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- remainingTime : 0
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- currentX : 65535
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- currentY : 65535
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- colorTemperature : 278
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- colorMode : 2
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- numPrimaries : 0
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- enhancedColorMode : 2
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- colorCapabilities : 25
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- colorTempPhysicalMin : 155
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- colorTempPhysicalMax : 450
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] --- haDiagnostic
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 65533 : 1
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- cid : haDiagnostic
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- sid : attrs
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- numberOfResets : 0
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- averageMacRetryPerApsMessageSent : 0
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- lastMessageLqi : 0
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- lastMessageRssi : 0
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] --- lightLink
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 65533 : 1
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- cid : lightLink
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- sid : attrs
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] - Endpoints: 1
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] -- Clusters:
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] --- zapp
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] --- genGreenPowerProxy
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 0 : 20
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 1 :
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 2 : 1
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 3 : 3
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 4 : 180
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 5 : 1
2020-03-22 21:28:36 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 6 : 1027631
2020-03-22 21:28:37 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 7 : 16777215
2020-03-22 21:28:37 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 32 : 3
2020-03-22 21:28:37 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 33 : [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
2020-03-22 21:28:37 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 34 : [ 90, 105, 103, 66, 101, 101, 65, 108, 108, 105, 97, 110, 99, 101, 48, 57 ]
2020-03-22 21:28:37 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- 65533 : 2
2020-03-22 21:28:37 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- cid : genGreenPowerProxy
2020-03-22 21:28:37 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ---- sid : attrs
2020-03-22 21:28:37 [log] [ManagerDrivers] [ZB_LED-dimmer_RGBW] [0] ------------------------------------------

*/

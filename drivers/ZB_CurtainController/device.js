'use strict';

const Homey = require('homey');
const { ZigBeeDevice } = require('homey-zigbeedriver');
const { CLUSTER } = require('zigbee-clusters');

module.exports = class ZB_CurtainController extends ZigBeeDevice {

  async onNodeInit({ zclNode }) {
    // Mark device as unavailable while configuring
    this.setUnavailable(this.homey.__('pairing.configuring')).catch(this.error);

    // enable debugging
    // this.enableDebug();

    // print the node's info to the console
    // this.printNode();

    if (this.hasCapability('onoff')) {
      this.registerCapability('onoff', CLUSTER.ON_OFF);
    }

    if (this.hasCapability('windowcoverings_state')) {
      this.registerCapability('windowcoverings_state', CLUSTER.WINDOW_COVERING, {
        endpoint: this.getClusterEndpoint(CLUSTER.WINDOW_COVERING),
      });
    }

    if (this.hasCapability('windowcoverings_set')) {
      // Register windowcoverings set capability and configure attribute reporting
      this.registerCapability('windowcoverings_set', CLUSTER.WINDOW_COVERING, {
        reportOpts: {
          configureAttributeReporting: {
            minInterval: 0, // No minimum reporting interval
            maxInterval: 60000, // Maximally every ~16 hours
            minChange: 5, // Report when value changed by 5
          },
        },
        endpoint: this.getClusterEndpoint(CLUSTER.WINDOW_COVERING),
      });
    }

    if (this.hasCapability('windowcoverings_tilt_set')) {
      this.registerCapability('windowcoverings_tilt_set', CLUSTER.WINDOW_COVERING, {
        reportOpts: {
          configureAttributeReporting: {
            minInterval: 2, // No minimum reporting interval
            maxInterval: 900, // Maximally every ~16 hours
            minChange: 5, // Report when value changed by 5
          },
        },
        endpoint: this.getClusterEndpoint(CLUSTER.WINDOW_COVERING),
      });
    }

    // Finally device is ready to be used, mark as available
    this.setAvailable().catch(this.error);
  }

  async onSettings({ oldSettings, newSettings, changedKeys }) {
    let changeSettingError = '';

    this.log(changedKeys);
    this.log('newSettings', newSettings);
    this.log('oldSettings', oldSettings);

    // Loop all changed settings
    for (const changedKey of changedKeys) {
      const newValue = newSettings[changedKey];

      try {
        if (changedKey.includes('window_covering_type')) {
          this.log('window_covering_type: ', changedKey, newValue);
          await this.zclNode.endpoints[this.getClusterEndpoint(CLUSTER.WINDOW_COVERING)].clusters[CLUSTER.WINDOW_COVERING.NAME].writeAttributes({windowCoveringType: newValue});
        }
      } catch (err) {
        this.error(`failed_to_set_${changedKey}_to_${newValue}`, err);
        let errorString = `${changeSettingError}failed_to_set_${changedKey}_to_${newValue}`;
        if (changeSettingError.length > 0) errorString = `_${errorString}`;
        changeSettingError = errorString;
      }
    }

    // If one or more of the settings failed to set, reject
    if (changeSettingError.length > 0) return Promise.reject(new Error(changeSettingError));

    // Compose save message
    const saveMessage = 'successfully saved the changed settings';
    return Promise.resolve(saveMessage);
  }

};

/*
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ZigBeeDevice has been inited
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ------------------------------------------
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] Node: 526d2432-9369-41ab-85f3-3b957c8c5a3e
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] - Battery: false
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] - Endpoints: 0
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] -- Clusters:
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] --- zapp
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] --- genBasic
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 9 : 255
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 10 : 00
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 11 : NULL
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 16389 : 0
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 30721 : 49246
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 30722 : 528
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 30723 : 255
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 30724 : 1
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 30725 : 0
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 34819 : 0
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 34820 : 0
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 36864 : 2
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 36865 : 1000
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 36866 : [ 38, 42, 74, 107, 56, 245, 92, 84, 9, 110, 248, 164, 142, 104, 181, 154 ]
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 36867 : 4644
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 65533 : 1
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- cid : genBasic
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- sid : attrs
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- zclVersion : 3
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- appVersion : 0
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- stackVersion : 0
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- hwVersion : 0
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- manufacturerName : Sunricher
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- modelId : Motor Controller
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- dateCode : NULL
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- powerSource : 1
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- appProfileVersion : 255
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- swBuildId : 2.5.3_r40
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] --- genIdentify
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 65533 : 1
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- cid : genIdentify
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- sid : attrs
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- identifyTime : 0
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] --- genGroups
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 65533 : 1
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- cid : genGroups
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- sid : attrs
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- nameSupport : 0
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] --- genScenes
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 65533 : 1
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- cid : genScenes
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- sid : attrs
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- count : 0
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- currentScene : 0
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- currentGroup : 0
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- sceneValid : 0
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- nameSupport : 0
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] --- genOnOff
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 16387 : 255
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 65533 : 1
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- cid : genOnOff
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- sid : attrs
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- onOff : 0
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- globalSceneCtrl : 1
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- onTime : 0
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- offWaitTime : 0
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] --- genLevelCtrl
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 15 : 1
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 16384 : 255
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 65533 : 1
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- cid : genLevelCtrl
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- sid : attrs
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- currentLevel : 0
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- remainingTime : 0
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- onOffTransitionTime : 1
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- onLevel : 255
2020-04-13 21:05:07 [log] [ManagerDrivers] [ZB_CurtainController] [0] --- genOta
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- cid : genOta
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- sid : attrs
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] --- closuresWindowCovering
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 19 : 24
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 65533 : 1
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- cid : closuresWindowCovering
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- sid : attrs
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- windowCoveringType : 0
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- currentPositionLiftCm : 0
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- currentPositionTiltDdegree : 0
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- configStatus : 3
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- currentPositionLiftPercentage : 0
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- currentPositionTiltPercentage : 100
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- installedOpenLimitLiftCm : 0
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- installedClosedLimitLiftCm : 92
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- installedOpenLimitTiltDdegree : 0
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- windowCoveringMode : 20
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] --- haDiagnostic
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 65533 : 1
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- cid : haDiagnostic
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- sid : attrs
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- numberOfResets : 0
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- averageMacRetryPerApsMessageSent : 0
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- lastMessageLqi : 0
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- lastMessageRssi : 0
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] --- lightLink
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 65533 : 1
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- cid : lightLink
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- sid : attrs
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] - Endpoints: 1
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] -- Clusters:
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] --- zapp
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] --- genGreenPowerProxy
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 0 : 20
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 1 :
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 2 : 1
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 3 : 3
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 4 : 180
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 5 : 1
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 6 : 1027631
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 7 : 16777215
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 32 : 3
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 33 : [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 34 : [ 90, 105, 103, 66, 101, 101, 65, 108, 108, 105, 97, 110, 99, 101, 48, 57 ]
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- 65533 : 2
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- cid : genGreenPowerProxy
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ---- sid : attrs
2020-04-13 21:05:08 [log] [ManagerDrivers] [ZB_CurtainController] [0] ------------------------------------------
*/

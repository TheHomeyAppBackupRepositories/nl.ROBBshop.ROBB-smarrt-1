'use strict';

const { Cluster, ScenesCluster, ZCLDataTypes } = require('zigbee-clusters');

class ROBBSpecificScenesCluster extends ScenesCluster {

  static get COMMANDS() {
    return {
      ...super.COMMANDS,
      recallScene: {
        id: 5,
        args: {
          groupId: ZCLDataTypes.uint16,
          sceneId: ZCLDataTypes.uint8,
        },
      },
    };
  }

  static get ATTRIBUTES() {
    return {
      ...super.ATTRIBUTES,
    };
  }

}

Cluster.addCluster(ROBBSpecificScenesCluster);

module.exports = ROBBSpecificScenesCluster;

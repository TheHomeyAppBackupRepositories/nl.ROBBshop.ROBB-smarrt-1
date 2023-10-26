'use strict';

const { Cluster, BasicCluster, ZCLDataTypes } = require('zigbee-clusters');

class ROBBSpecificBasicCluster extends BasicCluster {

  static get COMMANDS() {
    return {
      ...super.COMMANDS,
    };
  }

  static get ATTRIBUTES() {
    return {
      ...super.ATTRIBUTES,
      switchType: {
        id: 0x8803,
        type: ZCLDataTypes.uint8,
      },
      manufacturerId: 0x1224,
    }
  }

}

Cluster.addCluster(ROBBSpecificBasicCluster);

module.exports = ROBBSpecificBasicCluster;

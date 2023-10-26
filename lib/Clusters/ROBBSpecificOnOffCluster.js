'use strict';

const { Cluster, OnOffCluster, ZCLDataTypes } = require('zigbee-clusters');

class ROBBSpecificOnOffCluster extends OnOffCluster {

  static get COMMANDS() {
    return {
      ...super.COMMANDS,
    };
  }

  static get ATTRIBUTES() {
    return {
      ...super.ATTRIBUTES,
      startupOnOff: {
        id: 0x4003,
        type: ZCLDataTypes.enum8({
          off: 0,
          on: 1,
          toggle: 2,
          latest: 3,
        }),
      },

    }
  }

}

Cluster.addCluster(ROBBSpecificOnOffCluster);

module.exports = ROBBSpecificOnOffCluster;

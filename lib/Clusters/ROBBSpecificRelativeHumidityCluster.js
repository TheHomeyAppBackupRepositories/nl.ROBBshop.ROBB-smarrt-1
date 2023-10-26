'use strict';

const { Cluster, RelativeHumidityCluster, ZCLDataTypes } = require('zigbee-clusters');

class ROBBSpecificRelativeHumidityCluster extends RelativeHumidityCluster {

  static get COMMANDS() {
    return {
      ...super.COMMANDS,
    };
  }

  static get ATTRIBUTES() {
    return {
      ...super.ATTRIBUTES,
      humiditySensorCompensation: {
        id: 0x1000,
        type: ZCLDataTypes.int8,
        manufacturerId: 0x1224,
      }
    }
  }

}

Cluster.addCluster(ROBBSpecificRelativeHumidityCluster);

module.exports = ROBBSpecificRelativeHumidityCluster;

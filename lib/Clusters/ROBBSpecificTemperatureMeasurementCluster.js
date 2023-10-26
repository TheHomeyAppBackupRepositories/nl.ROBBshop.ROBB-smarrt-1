'use strict';

const { Cluster, TemperatureMeasurementCluster, ZCLDataTypes } = require('zigbee-clusters');

class ROBBSpecificTemperatureMeasurementCluster extends TemperatureMeasurementCluster {

  static get COMMANDS() {
    return {
      ...super.COMMANDS,
    };
  }

  static get ATTRIBUTES() {
    return {
      ...super.ATTRIBUTES,
      temperatureSensorCompensation: {
        id: 0x1000,
        type: ZCLDataTypes.int8,
        manufacturerId: 0x1224,
      }
    }
  }

}

Cluster.addCluster(ROBBSpecificTemperatureMeasurementCluster);

module.exports = ROBBSpecificTemperatureMeasurementCluster;

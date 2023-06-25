'use strict';

const { Cluster, ElectricalMeasurementCluster, ZCLDataTypes } = require('zigbee-clusters');

class ROBBSpecificElectricalMeasurementCluster extends ElectricalMeasurementCluster {

  static get COMMANDS() {
    return {
      ...super.COMMANDS,
    };
  }

  static get ATTRIBUTES() {
    return {
      ...super.ATTRIBUTES,
      acCurrentOverload: {
        id: 2050,
        type: ZCLDataTypes.int16
      },
      overCurrentAlarmValue: {
        id: 0x1000,
        type: ZCLDataTypes.uint8,
        manufacturerId: 0x1224,
      }
    };
  }

}

Cluster.addCluster(ROBBSpecificElectricalMeasurementCluster);

module.exports = ROBBSpecificElectricalMeasurementCluster;

'use strict';

const { Cluster, AlarmsCluster, ZCLDataTypes } = require('zigbee-clusters');

class ROBBSpecificAlarmsCluster extends AlarmsCluster {

  static get COMMANDS() {
    return {
      ...super.COMMANDS,
      overHeatAlarm: {
        id: 0,
        args: {},
        manufacturerId: 0x1224,
      },
    };
  }

  static get ATTRIBUTES() {
    return {
      ...super.ATTRIBUTES,
    }
  }

}

Cluster.addCluster(ROBBSpecificAlarmsCluster);

module.exports = ROBBSpecificAlarmsCluster;

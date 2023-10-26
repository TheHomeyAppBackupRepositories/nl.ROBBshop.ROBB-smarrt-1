'use strict';

const { Cluster, OccupancySensingCluster, ZCLDataTypes } = require('zigbee-clusters');

class ROBBSpecificOccupancySensingCluster extends OccupancySensingCluster {

  static get COMMANDS() {
    return {
      ...super.COMMANDS,
    };
  }

  static get ATTRIBUTES() {
    return {
      ...super.ATTRIBUTES,
      PIRSensorSensitivity: {
        id: 0x1000,
        type: ZCLDataTypes.enum8({
          disabled: 0, //
          high: 8, // high sensitivity
          default: 15, // normal sensitivity
          medium: 132, // medium sensitivity
          low: 255, // low sensitivity
        }),
        manufacturerId: 0x1224,
      },
      /*
      Motion detection blind time
      PIR sensor is "blind" (insensitive) to motion after last detection for the amount of time specified in this
      attribute, unit is 0.5S, default value is 15. Available settings: 0-15 (0.5-8 seconds, time [s] = 0.5 x (value+1))
      */
      motionDetectionBlindTime: {
        id: 0x1001,
        type: ZCLDataTypes.uint8,
        manufacturerId: 0x1224,
      }
    }
  }

}

Cluster.addCluster(ROBBSpecificOccupancySensingCluster);

module.exports = ROBBSpecificOccupancySensingCluster;

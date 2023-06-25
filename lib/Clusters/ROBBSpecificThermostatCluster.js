'use strict';

const { Cluster, ThermostatCluster, ZCLDataTypes } = require('zigbee-clusters');

class ROBBSpecificThermostatCluster extends ThermostatCluster {

  static get COMMANDS() {
    return {
      ...super.COMMANDS,
      setWeeklySchedule: {
        id: 1,
        args: {
          numberOfTransition: ZCLDataTypes.enum8({
            'zero': 0,
            'one': 1,
            'two': 2,
            'three': 3,
            'four': 4,
          }),
          dayOfWeek: ZCLDataTypes.map8('sun', 'mon', 'tue', 'wed', 'thu', 'fri',
            'sat', 'awayOrVacation'),
          mode: ZCLDataTypes.map8('heat', 'cool'),
          transitionTime1: ZCLDataTypes.uint16,
          heatSet1: ZCLDataTypes.int16,
          transitionTime2: ZCLDataTypes.uint16,
          heatSet2: ZCLDataTypes.int16,
          transitionTime3: ZCLDataTypes.uint16,
          heatSet3: ZCLDataTypes.int16,
          transitionTime4: ZCLDataTypes.uint16,
          heatSet4: ZCLDataTypes.int16,
        },
      },
      getWeeklySchedule: {
        id: 2,
        args: {
          daysToReturn: ZCLDataTypes.map8('sun', 'mon', 'tue', 'wed', 'thu', 'fri',
            'sat', 'awayOrVacation'),
          modeToReturn: ZCLDataTypes.map8('heat', 'cool'),
        },
      },
      getWeeklyScheduleResponse: {
        id: 0,
        args: {
          numberOfTransition: ZCLDataTypes.enum8({
            'zero': 0,
            'one': 1,
            'two': 2,
            'three': 3,
            'four': 4,
          }),
          dayOfWeek: ZCLDataTypes.map8('sun', 'mon', 'tue', 'wed', 'thu', 'fri',
            'sat', 'awayOrVacation'),
          /* dayOfWeek: ZCLDataTypes.uint8, */
          mode: ZCLDataTypes.map8('heat', 'cool'),
          transitionTime1: ZCLDataTypes.uint16,
          heatSet1: ZCLDataTypes.int16,
          transitionTime2: ZCLDataTypes.uint16,
          heatSet2: ZCLDataTypes.int16,
          transitionTime3: ZCLDataTypes.uint16,
          heatSet3: ZCLDataTypes.int16,
          transitionTime4: ZCLDataTypes.uint16,
          heatSet4: ZCLDataTypes.int16,
        },
      },
    };
  }

  static get ATTRIBUTES() {
    return {
      ...super.ATTRIBUTES,
      localTemperatureCalibration:{
        id: 0x0010,
        type: ZCLDataTypes.int8,
      },
      startOfWeek: {
        id: 0x20,
        type: ZCLDataTypes.enum8({
          sun: 0,
          mon: 1,
          tue: 2,
          wed: 3,
          thu: 4,
          fri: 5,
          sat: 6,
        }),
      },
      thermostatRunningState: {
        id: 0x29,
        type: ZCLDataTypes.map16('heatStateOn', 'coolStateOn', 'fanStateOn', 'heat2ndStageStateOn', 'cool2ndStageStateOn', 'fan2ndStageStateOn',
          'fan3rdStageStateOn'),
      },
      // Private attributes
      displayBrightness: {
        id: 0x1000,
        type: ZCLDataTypes.enum8({
          low: 0,
          medium: 1,
          high: 2,
        }),
        manufacturerId: 0x1224,
      },
      buttonVibrationLevel: {
        id: 0x1001,
        type: ZCLDataTypes.enum8({
          low: 0,
          medium: 1,
          high: 2,
        }),
        manufacturerId: 0x1224,
      },
      floorSensorType: {
        id: 0x1002,
        type: ZCLDataTypes.enum8({
          '10K': 1,
          '15K': 2,
          '50K': 3,
          '100K': 4,
          '12K': 5,
        }),
        manufacturerId: 0x1224,
      },
      thermostatControlMode: {
        id: 0x1003,
        type: ZCLDataTypes.enum8({
          room: 0,
          floor: 1,
          both: 2,
        }),
        manufacturerId: 0x1224,
      },
      saveState: {
        id: 0x1004,
        type: ZCLDataTypes.enum8({
          default: 0,
          lastStatus: 1,
        }),
        manufacturerId: 0x1224,
      },
      floorSensorCalibration: {
        id: 0x1005,
        type: ZCLDataTypes.int8,
        manufacturerId: 0x1224,
      },
      dryTime: {
        id: 0x1006,
        type: ZCLDataTypes.uint8,
        manufacturerId: 0x1224,
      },
      modeAfterDry: {
        id: 0x1007,
        type: ZCLDataTypes.enum8({
          off: 0,
          manual: 1,
          auto: 2,
          away: 3,
        }),
        manufacturerId: 0x1224,
      },
      displayTemperature: {
        id: 0x1008,
        type: ZCLDataTypes.enum8({
          room: 0,
          floor: 1,
        }),
        manufacturerId: 0x1224,
      },
      windowOpenCheck: {
        id: 0x1009,
        type: ZCLDataTypes.uint8,
        manufacturerId: 0x1224,
      },
      temperatureControlHysteresis: {
        id: 0x100A,
        type: ZCLDataTypes.uint8,
        manufacturerId: 0x1224,
      },
      displayAutoOff: {
        id: 0x100B,
        type: ZCLDataTypes.enum8({
          disabled: 0,
          enabled: 1,
        }),
        manufacturerId: 0x1224,
      },
      roomTemperatureAlarmValue: {
        id: 0x2001,
        type: ZCLDataTypes.uint8,
        manufacturerId: 0x1224,
      },
      awayMode: {
        id: 0x2002,
        type: ZCLDataTypes.enum8({
          awayModeInActive: 0,
          awayModeActive: 1,
        }),
        manufacturerId: 0x1224,
      },
    };
  }

}

Cluster.addCluster(ROBBSpecificThermostatCluster);

module.exports = ROBBSpecificThermostatCluster;

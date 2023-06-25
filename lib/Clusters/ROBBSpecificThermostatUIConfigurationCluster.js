'use strict';

const { Cluster, ZCLDataTypes } = require('zigbee-clusters');

const ATTRIBUTES = {
  temperatureDisplayMode: {
    id: 0,
    type: ZCLDataTypes.enum8({
      temperatureInC: 0,
      temperatureInF: 1,
    }),
  },
  keypadLockout: {
    id: 1,
    type: ZCLDataTypes.enum8({
      noLockout: 0,
      level1Lockout: 1,
      level2Lockout: 2,
      level3Lockout: 3,
      level4Lockout: 4,
      level5Lockout: 5,
    }),
  },
  scheduleProgrammingVisibility: {
    id: 27,
    type: ZCLDataTypes.enum8({
      localScheduleProgrammingFunctionalityEnabled: 0,
      localScheduleProgrammingFunctionalityEnabled: 1,
    }),
  },
};

const COMMANDS = {
};

class ThermostatUIConfigurationCluster extends Cluster {

  static get ID() {
    return 516;
  }

  static get NAME() {
    return 'thermostatUIConfiguration';
  }

  static get ATTRIBUTES() {
    return ATTRIBUTES;
  }

  static get COMMANDS() {
    return COMMANDS;
  }

}

module.exports = ThermostatUIConfigurationCluster;

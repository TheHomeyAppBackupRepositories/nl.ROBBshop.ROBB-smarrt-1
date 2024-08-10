'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { debug, CLUSTER } = require('zigbee-clusters');
const OnOffBoundCluster = require('./Clusters/OnOffBoundCluster');
const LevelControlBoundCluster = require('./Clusters/LevelControlBoundCluster');
const ScenesBoundCluster = require('./Clusters/ScenesBoundCluster');

module.exports = class ZBWallControllerDevice extends ZigBeeDevice {

  async onNodeInit({ zclNode }) {
    // Enables debug logging in zigbee-clusters
    // debug(true);

    this.registerCapability('alarm_battery', CLUSTER.POWER_CONFIGURATION, {
      getOpts: {
        getOnStart: true,
      },
      reportOpts: {
        configureAttributeReporting: {
          minInterval: 0, // No minimum reporting interval
          maxInterval: 60000, // Maximally every ~16 hours
          minChange: 5, // Report when value changed by 5
        },
      },
    });

    this.registerCapability('measure_battery', CLUSTER.POWER_CONFIGURATION, {
      getOpts: {
        getOnStart: true,
      },
      reportParser(value) {
        // Sunricher wall controllers don't report conform Zigbee specifications
        if (value <= 100 && value !== 255) {
          return Math.round(value);
        }
        return null;
      },
      reportOpts: {
        configureAttributeReporting: {
          minInterval: 0, // No minimum reporting interval
          maxInterval: 60000, // Maximally every ~16 hours
          minChange: 5, // Report when value changed by 5
        },
      },
    });

    Object.keys(this.zclNode.endpoints)
      .forEach(endpoint => {
        // Bind on/off button commands
        zclNode.endpoints[endpoint].bind(CLUSTER.ON_OFF.NAME, new OnOffBoundCluster({
          onSetOff: this._commandHandler.bind(this, 'off', endpoint),
          onSetOn: this._commandHandler.bind(this, 'on', endpoint),
        }));

        // Bind long press on/off button commands
        zclNode.endpoints[endpoint].bind(CLUSTER.LEVEL_CONTROL.NAME, new LevelControlBoundCluster({
          onStop: this._commandHandler.bind(this, 'stop', endpoint),
          onStopWithOnOff: this._commandHandler.bind(this, 'stopWithOnOff', endpoint),
          onMove: this._commandHandler.bind(this, ',move', endpoint),
          onMoveWithOnOff: this._commandHandler.bind(this, 'moveWithOnOff', endpoint),
        }));
      });
  }

  /**
   * Trigger a Flow based on the `type` parameter.
   */
  _commandHandler(command, endpoint, payload) {
    let remoteValue = {};
    if (command === 'moveWithOnOff') {
      remoteValue = {
        button: this.buttonMap[endpoint],
        scene: this.sceneMap[`${command}_move_${payload.moveMode}`],
      };
    } else if (command === 'scene') {
      remoteValue = {
        button: `Scene-${payload.sceneId}`,
        scene: 'Key Pressed 1 time',
      };
    } else {
      remoteValue = {
        button: this.buttonMap[endpoint],
        scene: this.sceneMap[`${command}`],
      };
    }
    this.log('Triggering sequence: remoteValue', remoteValue);

    // Trigger the trigger card with 2 dropdown option
    this.triggerFlow({
      id: 'wall_controller_scene',
      tokens: null,
      state: remoteValue,
    })
      .catch(err => this.error('Error triggering wall_controller_scene', err));

    // Trigger the trigger card with tokens
    this.triggerFlow({
      id: 'wall_controller_button',
      tokens: remoteValue,
      state: null,
    })
      .catch(err => this.error('Error triggering wall_controller_button', err));
  }

  onSceneAutocomplete(query, args, callback) {
    const sceneIdsAllowed = ['keyPressedOneTime'];

    const sceneMapRaw = this.sceneMap;
    const sceneMapFiltered = Object.keys(sceneMapRaw)
      .filter(key => ((args.button.id === 'Scene-1' || args.button.id === 'Scene-2') ? sceneIdsAllowed.includes(key) : !sceneIdsAllowed.includes(key)))
      .reduce((obj, key) => {
        obj[key] = sceneMapRaw[key];
        return obj;
      }, {});

    let resultArray = [];

    for (const sceneID in sceneMapFiltered) {
      resultArray.push({
        id: this.sceneMap[sceneID],
        name: this.homey.__(this.sceneMap[sceneID]),
      });
    }
    // filter for query
    resultArray = resultArray.filter(result => {
      return result.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
    });
    this.log(resultArray);
    return Promise.resolve(resultArray);
  }

  onButtonAutocomplete(query, args, callback) {
    let resultArray = [];
    for (const sceneID in this.buttonMap) {
      resultArray.push({
        id: this.buttonMap[sceneID],
        name: this.homey.__(this.buttonMap[sceneID]),
      });
    }

    // filter for query
    resultArray = resultArray.filter(result => {
      return result.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
    });
    this.log(resultArray);
    return Promise.resolve(resultArray);
  }

};

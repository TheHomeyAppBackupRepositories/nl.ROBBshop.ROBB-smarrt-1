'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { debug, Cluster, CLUSTER } = require('zigbee-clusters');
const OnOffBoundCluster = require('../../lib/Clusters/OnOffBoundCluster');
const LevelControlBoundCluster = require('../../lib/Clusters/LevelControlBoundCluster');
const ColorControlBoundCluster = require('../../lib/Clusters/ColorControlBoundCluster');
const {
  mapValueRange,
} = require('../../node_modules/homey-zigbeedriver/lib/util');

module.exports = class ZB_WallController_rotary extends ZigBeeDevice {

  async onNodeInit({ zclNode }) {
    // Mark device as unavailable while configuring
    this.setUnavailable(this.homey.__('pairing.configuring')).catch(this.error);

    // enable debugging
    // this.enableDebug();

    // Enables debug logging in zigbee-clusters
    // debug(true);

    // print the node's info to the console
    // this.printNode();

    if (this.hasCapability('onoff')) {
      this.removeCapability('onoff').catch(this.error);
    }
    if (this.hasCapability('dim')) {
      this.removeCapability('dim').catch(this.error);
    }

    await super.onNodeInit({ zclNode });

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
          onSetOff: this._onOffCommandHandler.bind(this, 'off', endpoint),
          onSetOn: this._onOffCommandHandler.bind(this, 'on', endpoint),
        }));

        // Bind long press on/off button commands
        zclNode.endpoints[endpoint].bind(CLUSTER.LEVEL_CONTROL.NAME, new LevelControlBoundCluster({
          onMoveToLevelWithOnOff: this._levelCommandHandler.bind(this, 'moveToLevelWithOnOff', endpoint),
        }));

        // Bind long press on/off button commands
        zclNode.endpoints[endpoint].bind(CLUSTER.COLOR_CONTROL.NAME, new ColorControlBoundCluster({
          onMoveToColorTemperature: this._colorCommandHandler.bind(this, 'moveToColorTemperature', endpoint),
          onMoveToHue: this._colorCommandHandler.bind(this, 'moveToHue', endpoint),
        }));
      });

    // Finally device is ready to be used, mark as available
    this.setAvailable().catch(this.error);
  }

  /**
   * Trigger a Flow based on the `type` parameter.
   * @param {'on'|'off'} type
   * @private
   */
  _onOffCommandHandler(command, endpoint, payload) {
    if (command !== 'on' && command !== 'off') throw new Error('invalid_onoff_type');
    this.log('_onOffCommandHandler |', command, endpoint, payload);
    this.triggerFlow({
      id: `wall_controller_onoff_${command === 'on'}`,
    })
      .then(() => this.log(`flow was triggered: wall_controller_onoff_${command}`))
      .catch(err => this.error(`Error: triggering flow: wall_controller_onoff_${command}`, err));
  }

  /**
   * Trigger a Flow based on the `type` parameter.
   * @param {'on'|'off'} type
   * @private
   */
  _levelCommandHandler(command, endpoint, payload) {
    // if (command !== 'on' && command !== 'off') throw new Error('invalid_onoff_type');
    const parsedPayloadLevel = Math.round((payload.level / 255) * 100) / 100; // round payload value to 2 decimals
    this.log('_levelCommandHandler |', command, endpoint, payload, parsedPayloadLevel, payload.transitionTime);
    this.triggerFlow({
      id: 'wall_controller_dim_changed',
      tokens: { dim: parsedPayloadLevel },
      state: null,
    })
      .then(() => this.log('flow was triggered: wall_controller_dim_changed, dim level', parsedPayloadLevel))
      .catch(err => this.error('Error: triggering flow: wall_controller_dim_changed', err));
  }

  /**
   * Trigger a Flow based on the `type` parameter.
   * @param {'on'|'off'} type
   * @private
   */
  _colorCommandHandler(command, endpoint, payload) {
    // if (command !== 'on' && command !== 'off') throw new Error('invalid_onoff_type');
    this.log('_colorCommandHandler |', command, endpoint, payload);
    if (command === 'moveToColorTemperature') {
      const colorTemperature = mapValueRange(0, 450, 0, 1, payload.colorTemperature);
      this.log('_colorCommandHandler |', command, payload.colorTemperature, payload.transitionTime, colorTemperature);
      this.triggerFlow({ id: 'wall_controller_color_temperature_changed', tokens: { colorTemperature }, state: {} })
        .then(() => this.log('flow was triggered: wall_controller_color_temperature_changed, colorTemperature', colorTemperature))
        .catch(err => this.error('Error: triggering flow: wall_controller_color_temperature_changed', err));
    }
    if (command === 'moveToHue') {
      const parsedPayloadhue = Math.round((payload.hue / 224) * 100) / 100; // round payload value to 2 decimals
      this.log('_colorCommandHandler |', command, payload.hue, payload.direction, payload.transitionTime);
      this.triggerFlow({ id: 'wall_controller_hue_changed', tokens: { hue: parsedPayloadhue }, state: {} })
        .then(() => this.log('flow was triggered: wall_controller_hue_changed, hue level', parsedPayloadhue))
        .catch(err => this.error('Error: triggering flow: wall_controller_hue_changed', err));
    }
  }

};

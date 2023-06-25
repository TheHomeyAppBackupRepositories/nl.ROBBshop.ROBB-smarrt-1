'use strict';

const { BoundCluster } = require('zigbee-clusters');

class ColorControlBoundCluster extends BoundCluster {

  constructor({
    onMoveToHue,
    onMoveToColorTemperature,
  }) {
    super();
    this._onMoveToHue = onMoveToHue;
    this._onMoveToColorTemperature = onMoveToColorTemperature;
  }

  moveToHue(payload) {
    if (typeof this._onMoveToHue === 'function') {
      this._onMoveToHue(payload);
    }
  }

  moveToColorTemperature(payload) {
    if (typeof this._onMoveToColorTemperature === 'function') {
      this._onMoveToColorTemperature(payload);
    }
  }

}

module.exports = ColorControlBoundCluster;

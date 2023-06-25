'use strict';

const { BoundCluster } = require('zigbee-clusters');

class LevelControlBoundCluster extends BoundCluster {

  constructor({
    onStep,
    onStepWithOnOff,
    onMove,
    onStopWithOnOff,
    onStop,
    onMoveWithOnOff,
    onMoveToLevelWithOnOff,
  }) {
    super();
    this._onStep = onStep;
    this._onStepWithOnOff = onStepWithOnOff;
    this._onMove = onMove;
    this._onStopWithOnOff = onStopWithOnOff;
    this._onStop = onStop;
    this._onMoveWithOnOff = onMoveWithOnOff;
    this._onMoveToLevelWithOnOff = onMoveToLevelWithOnOff;
  }

  step(payload) {
    if (typeof this._onStep === 'function') {
      this._onStep(payload);
    }
  }

  stepWithOnOff(payload) {
    if (typeof this._onStepWithOnOff === 'function') {
      this._onStepWithOnOff(payload);
    }
  }

  move(payload) {
    if (typeof this._onMove === 'function') {
      this._onMove(payload);
    }
  }

  moveWithOnOff(payload) {
    if (typeof this._onMoveWithOnOff === 'function') {
      this._onMoveWithOnOff(payload);
    }
  }

  moveToLevelWithOnOff(payload) {
    if (typeof this._onMoveToLevelWithOnOff === 'function') {
      this._onMoveToLevelWithOnOff(payload);
    }
  }

  stop(payload) {
    if (typeof this._onStop === 'function') {
      this._onStop(payload);
    }
  }

  stopWithOnOff(payload) {
    if (typeof this._onStopWithOnOff === 'function') {
      this._onStopWithOnOff(payload);
    }
  }

}

module.exports = LevelControlBoundCluster;

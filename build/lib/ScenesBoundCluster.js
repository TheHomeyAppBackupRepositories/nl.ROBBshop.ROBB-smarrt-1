'use strict';

const { BoundCluster } = require('zigbee-clusters');

class ScenesBoundCluster extends BoundCluster {

  constructor({
    onRecallScene,
  }) {
    super();
    this._onRecallScene = onRecallScene;
  }

  recallScene(payload) {
    if (typeof this._onRecallScene === 'function') {
      this._onRecallScene(payload);
    }
  }

}

module.exports = ScenesBoundCluster;

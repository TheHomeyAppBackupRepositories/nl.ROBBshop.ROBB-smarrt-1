'use strict';

const { ZigBeeLightDevice } = require('homey-zigbeedriver');
const { CLUSTER } = require('zigbee-clusters');

class ZBLEDLightBulbTunable extends ZigBeeLightDevice {

  async onNodeInit({ zclNode }) {
    // Mark device as unavailable while configuring
    await this.setUnavailable(this.homey.__('pairing.configuring')).catch(this.error);

    await super.onNodeInit({ zclNode });
    // enable debugging
    // this.enableDebug();

    // print the node's info to the console
    // this.printNode();

    await this.setAvailable();
    this.log('ZB LED Light Bulb - Tunable has been inited');
  }

}

module.exports = ZBLEDLightBulbTunable;

'use strict';

// const { ZigBeeLightDevice } = require('homey-meshdriver');
const ZBDimmerDevice = require('../../lib/ZBDimmerDevice');

module.exports = class ZB_LEDdimmer_White extends ZBDimmerDevice {

  async onNodeInit({ zclNode }) {
    const { manifest } = this.driver;
    await this.setSettings({ zb_endpoint_descriptors: manifest.zigbee.endpoints });

    // Mark device as unavailable while configuring
    this.setUnavailable(this.homey.__('pairing.configuring')).catch(this.error);

    // enable debugging
    // this.enableDebug();

    // print the node's info to the console
    // this.printNode();

    await super.onNodeInit({ zclNode });

    // Finally device is ready to be used, mark as available
    this.setAvailable().catch(this.error);
  }

};

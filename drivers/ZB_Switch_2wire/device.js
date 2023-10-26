'use strict';

const ZBSwitchDevice = require('../../lib/ZBSwitchDevice');

module.exports = class ZB_Switch2wire extends ZBSwitchDevice {

  async onNodeInit({ zclNode }) {
    // Mark device as unavailable while configuring
    this.setUnavailable(this.homey.__('pairing.configuring')).catch(this.error);

    // enable debugging
    // this.enableDebug();

    // print the node's info to the console
    // this.printNode();

    this.endpointIds = {
      firstOutlet: 1,
    };

    await super.onNodeInit({ zclNode });

    // Finally device is ready to be used, mark as available
    this.setAvailable().catch(this.error);
  }

};

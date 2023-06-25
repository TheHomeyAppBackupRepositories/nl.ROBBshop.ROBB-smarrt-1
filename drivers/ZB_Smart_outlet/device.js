'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { debug, CLUSTER } = require('zigbee-clusters');
const ZBSwitchDevice = require('../../lib/ZBSwitchDevice');

module.exports = class ZBSmartOutletDevice extends ZBSwitchDevice {

  async onNodeInit({ zclNode }) {
    // Mark device as unavailable while configuring
    this.setUnavailable(this.homey.__('pairing.configuring')).catch(this.error);

    // this.enableDebug();

    // this.printNode();

    // Enables debug logging in zigbee-clusters
    // debug(true);

    this.endpointIds = {
      firstOutlet: 1,
      secondOutlet: 2,
      thirdOutlet: 3,
      fourthOutlet: 4,
      usbOutlet: 5,
    };

    await super.onNodeInit({ zclNode });

    // onoff
    // if (this.hasCapability('onoff')) {
    //  this.registerCapability('onoff', CLUSTER.ON_OFF, {
    //    endpoint: this.endpointIds[subDeviceId],
    //  });
    // }

    // Finally device is ready to be used, mark as available
    this.setAvailable().catch(this.error);
  }

};

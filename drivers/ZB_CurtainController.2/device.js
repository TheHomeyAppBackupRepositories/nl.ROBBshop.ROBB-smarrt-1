'use strict';

const Homey = require('homey');
const { ZigBeeDevice } = require('homey-zigbeedriver');
const { CLUSTER } = require('zigbee-clusters');

module.exports = class ZB_CurtainController2 extends ZigBeeDevice {

  async onNodeInit({ zclNode }) {
    // Mark device as unavailable while configuring
    this.setUnavailable(this.homey.__('pairing.configuring')).catch(this.error);

    // enable debugging
    // this.enableDebug();

    // print the node's info to the console
    // this.printNode();

    if (this.hasCapability('windowcoverings_set')) {
      // Register windowcoverings set capability and configure attribute reporting
      this.registerCapability('windowcoverings_set', CLUSTER.WINDOW_COVERING, {
        reportOpts: {
          configureAttributeReporting: {
            minInterval: 0, // No minimum reporting interval
            maxInterval: 60000, // Maximally every ~16 hours
            minChange: 5, // Report when value changed by 5
          },
        },
        endpoint: this.getClusterEndpoint(CLUSTER.WINDOW_COVERING),
      });
    }

    if (this.hasCapability('windowcoverings_tilt_set')) {
      this.registerCapability('windowcoverings_tilt_set', CLUSTER.WINDOW_COVERING, {
        reportOpts: {
          configureAttributeReporting: {
            minInterval: 2, // No minimum reporting interval
            maxInterval: 900, // Maximally every ~16 hours
            minChange: 5, // Report when value changed by 5
          },
        },
        endpoint: this.getClusterEndpoint(CLUSTER.WINDOW_COVERING),
      });
    }

    // Finally device is ready to be used, mark as available
    this.setAvailable().catch(this.error);
  }

  async onSettings({ oldSettings, newSettings, changedKeys }) {
    let changeSettingError = '';

    this.log(changedKeys);
    this.log('newSettings', newSettings);
    this.log('oldSettings', oldSettings);

    // Loop all changed settings
    for (const changedKey of changedKeys) {
      const newValue = newSettings[changedKey];

      try {
        if (changedKey.includes('window_covering_type')) {
          this.log('window_covering_type: ', changedKey, newValue);
          await this.zclNode.endpoints[this.getClusterEndpoint(CLUSTER.WINDOW_COVERING)].clusters[CLUSTER.WINDOW_COVERING.NAME].writeAttributes({windowCoveringType: newValue});
        }
      } catch (err) {
        this.error(`failed_to_set_${changedKey}_to_${newValue}`, err);
        let errorString = `${changeSettingError}failed_to_set_${changedKey}_to_${newValue}`;
        if (changeSettingError.length > 0) errorString = `_${errorString}`;
        changeSettingError = errorString;
      }
    }

    // If one or more of the settings failed to set, reject
    if (changeSettingError.length > 0) return Promise.reject(new Error(changeSettingError));

    // Compose save message
    const saveMessage = 'successfully saved the changed settings';
    return Promise.resolve(saveMessage);
  }

};

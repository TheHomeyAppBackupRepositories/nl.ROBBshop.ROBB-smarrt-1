'use strict';

const Homey = require('homey');
const ZWDimmerDevice = require('../../lib/ZWDimmerDevice');

module.exports = class ZW_Dimmer3wire extends ZWDimmerDevice {

  async onNodeInit({ node }) {
    // Mark device as unavailable while configuring
    this.setUnavailable(this.homey.__('pairing.configuring')).catch(this.error);

    // enable debugging
    // this.enableDebug();

    // print the node's info to the console
    // this.printNode();

    await super.onNodeInit({ node });

    // Finally device is ready to be used, mark as available
    this.setAvailable().catch(this.error);
  }

};

/*
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] ZwaveDevice has been inited
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] Node: 177 | Manufacturer id: 816 | ProductType id: 512 | Product id: 53253 | Firmware id: 53765 | Secure: ✓ | Battery: false
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] ------------------------------------------
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] Node: 177
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] - Manufacturer id: 816
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] - ProductType id: 512
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] - Product id: 53253
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] - Firmware id: 53765
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] - Secure: ✓
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] - Battery: false
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] - DeviceClassBasic: BASIC_TYPE_ROUTING_SLAVE
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] - DeviceClassGeneric: GENERIC_TYPE_SWITCH_MULTILEVEL
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] - DeviceClassSpecific: SPECIFIC_TYPE_POWER_SWITCH_MULTILEVEL
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] - Token: a508803f-4838-4467-b110-b9de8751a051
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] - CommandClass: COMMAND_CLASS_ZWAVEPLUS_INFO
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Version: 2
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Commands:
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- ZWAVEPLUS_INFO_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- ZWAVEPLUS_INFO_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] - CommandClass: COMMAND_CLASS_MANUFACTURER_SPECIFIC
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Version: 2
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Commands:
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- MANUFACTURER_SPECIFIC_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- MANUFACTURER_SPECIFIC_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- DEVICE_SPECIFIC_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- DEVICE_SPECIFIC_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] - CommandClass: COMMAND_CLASS_VERSION
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Version: 2
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Commands:
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- VERSION_COMMAND_CLASS_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- VERSION_COMMAND_CLASS_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- VERSION_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- VERSION_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] - CommandClass: COMMAND_CLASS_SWITCH_MULTILEVEL
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Version: 4
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Commands:
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SWITCH_MULTILEVEL_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SWITCH_MULTILEVEL_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SWITCH_MULTILEVEL_SET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SWITCH_MULTILEVEL_START_LEVEL_CHANGE
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SWITCH_MULTILEVEL_STOP_LEVEL_CHANGE
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SWITCH_MULTILEVEL_SUPPORTED_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SWITCH_MULTILEVEL_SUPPORTED_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] - CommandClass: COMMAND_CLASS_SCENE_ACTIVATION
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Version: 1
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Commands:
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SCENE_ACTIVATION_SET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] - CommandClass: COMMAND_CLASS_SCENE_ACTUATOR_CONF
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Version: 1
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Commands:
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SCENE_ACTUATOR_CONF_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SCENE_ACTUATOR_CONF_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SCENE_ACTUATOR_CONF_SET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] - CommandClass: COMMAND_CLASS_NOTIFICATION
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Version: 8
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Commands:
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- NOTIFICATION_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- NOTIFICATION_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- NOTIFICATION_SET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- NOTIFICATION_SUPPORTED_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- NOTIFICATION_SUPPORTED_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- EVENT_SUPPORTED_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- EVENT_SUPPORTED_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] - CommandClass: COMMAND_CLASS_CONFIGURATION
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Version: 2
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Commands:
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- CONFIGURATION_BULK_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- CONFIGURATION_BULK_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- CONFIGURATION_BULK_SET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- CONFIGURATION_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- CONFIGURATION_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- CONFIGURATION_SET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] - CommandClass: COMMAND_CLASS_ASSOCIATION
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Version: 2
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Commands:
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- ASSOCIATION_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- ASSOCIATION_GROUPINGS_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- ASSOCIATION_GROUPINGS_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- ASSOCIATION_REMOVE
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- ASSOCIATION_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- ASSOCIATION_SET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- ASSOCIATION_SPECIFIC_GROUP_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- ASSOCIATION_SPECIFIC_GROUP_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] - CommandClass: COMMAND_CLASS_ASSOCIATION_GRP_INFO
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Version: 3
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Commands:
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- ASSOCIATION_GROUP_NAME_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- ASSOCIATION_GROUP_NAME_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- ASSOCIATION_GROUP_INFO_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- ASSOCIATION_GROUP_INFO_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- ASSOCIATION_GROUP_COMMAND_LIST_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- ASSOCIATION_GROUP_COMMAND_LIST_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] - CommandClass: COMMAND_CLASS_POWERLEVEL
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Version: 1
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Commands:
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- POWERLEVEL_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- POWERLEVEL_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- POWERLEVEL_SET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- POWERLEVEL_TEST_NODE_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- POWERLEVEL_TEST_NODE_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- POWERLEVEL_TEST_NODE_SET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] - CommandClass: COMMAND_CLASS_DEVICE_RESET_LOCALLY
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Version: 1
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Commands:
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- DEVICE_RESET_LOCALLY_NOTIFICATION
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] - CommandClass: COMMAND_CLASS_TRANSPORT_SERVICE
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Version: 2
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Commands:
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- COMMAND_FIRST_SEGMENT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- COMMAND_SEGMENT_COMPLETE
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- COMMAND_SEGMENT_REQUEST
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- COMMAND_SEGMENT_WAIT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- COMMAND_SUBSEQUENT_SEGMENT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] - CommandClass: COMMAND_CLASS_SECURITY
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Version: 1
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Commands:
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- NETWORK_KEY_SET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- NETWORK_KEY_VERIFY
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SECURITY_COMMANDS_SUPPORTED_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SECURITY_COMMANDS_SUPPORTED_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SECURITY_MESSAGE_ENCAPSULATION
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SECURITY_MESSAGE_ENCAPSULATION_NONCE_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SECURITY_NONCE_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SECURITY_NONCE_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SECURITY_SCHEME_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SECURITY_SCHEME_INHERIT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SECURITY_SCHEME_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] - CommandClass: COMMAND_CLASS_SECURITY_2
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Version: 1
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Commands:
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SECURITY_2_NONCE_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SECURITY_2_NONCE_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SECURITY_2_MESSAGE_ENCAPSULATION
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- KEX_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- KEX_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- KEX_SET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- KEX_FAIL
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- PUBLIC_KEY_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SECURITY_2_NETWORK_KEY_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SECURITY_2_NETWORK_KEY_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SECURITY_2_NETWORK_KEY_VERIFY
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SECURITY_2_TRANSFER_END
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SECURITY_2_COMMANDS_SUPPORTED_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SECURITY_2_COMMANDS_SUPPORTED_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SECURITY_2_CAPABILITIES_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SECURITY_2_CAPABILITIES_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] - CommandClass: COMMAND_CLASS_SUPERVISION
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Version: 1
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Commands:
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SUPERVISION_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- SUPERVISION_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] - CommandClass: COMMAND_CLASS_FIRMWARE_UPDATE_MD
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Version: 4
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Commands:
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- FIRMWARE_MD_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- FIRMWARE_MD_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- FIRMWARE_UPDATE_MD_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- FIRMWARE_UPDATE_MD_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- FIRMWARE_UPDATE_MD_REQUEST_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- FIRMWARE_UPDATE_MD_REQUEST_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- FIRMWARE_UPDATE_MD_STATUS_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- FIRMWARE_UPDATE_ACTIVATION_SET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- FIRMWARE_UPDATE_ACTIVATION_STATUS_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] - CommandClass: COMMAND_CLASS_BASIC
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Version: 2
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] -- Commands:
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- BASIC_GET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- BASIC_REPORT
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] --- BASIC_SET
2019-11-30 10:48:00 [log] [ManagerDrivers] [ZW_Dimmer_3wire] [0] ------------------------------------------
*/

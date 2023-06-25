'use strict';

const Homey = require('homey');
const { ZwaveDevice } = require('homey-zwavedriver');

module.exports = class ZW_CurtainController extends ZwaveDevice {

  async onNodeInit({ node }) {
    // Mark device as unavailable while configuring
    this.setUnavailable(this.homey.__('pairing.configuring')).catch(this.error);

    // enable debugging
    // this.enableDebug();

    // print the node's info to the console
    // this.printNode();

    if (this.hasCapability('onoff')) {
      this.registerCapability('onoff', 'SWITCH_MULTILEVEL');
    }

    if (this.hasCapability('windowcoverings_state')) {
      this.registerCapability('windowcoverings_state', 'SWITCH_BINARY');
    }

    if (this.hasCapability('windowcoverings_set')) {
      // Register windowcoverings set capability and configure attribute reporting
      this.registerCapability('windowcoverings_set', 'SWITCH_MULTILEVEL');
    }

    if (this.hasCapability('windowcoverings_tilt_set')) {
      this.registerCapability('windowcoverings_tilt_set', 'SWITCH_MULTILEVEL');
    }

    if (this.hasCapability('meter_power')) {
      this.registerCapability('meter_power', 'METER');
      if (!this.hasCapability('button.reset_meter')) {
        await this.addCapability('button.reset_meter').catch(this.error);
      }
    }

    if (this.hasCapability('button.reset_meter')) {
      // Listen for reset_meter maintenance action
      this.registerCapabilityListener('button.reset_meter', async () => {
        // Maintenance action button was pressed, return a promise
        if (typeof this.meterReset === 'function') return this.meterReset();
        this.error('Reset meter failed');
        throw new Error('Reset meter not supported');
      });
    }

    if (this.hasCapability('measure_power')) {
      this.registerCapability('measure_power', 'METER');
    }

    // Finally device is ready to be used, mark as available
    this.setAvailable().catch(this.error);
  }

};

/*

async _actionStartDimLevelChangeRunListener(args, state) {
		if (!args.hasOwnProperty('direction')) return Promise.reject('direction_property_missing');
		args.device.log('FlowCardAction triggered to start dim level change in direction', args.direction);

		const nodeCommandClassVersion = parseInt(args.device.node.CommandClass.COMMAND_CLASS_SWITCH_MULTILEVEL.version);

		let startLevelChangeObj = {
			'Properties1': new Buffer([args.direction === '1' ? (nodeCommandClassVersion > 2 ? 0x68 : 0x60) : 0x20]),
			'Start Level': 0,
			'Dimming Duration': args.duration / 1000 || 255, // if no duration has been set, use factory default (255),
			'Step Size': 1,
		}

		if (args.device.node.CommandClass.COMMAND_CLASS_SWITCH_MULTILEVEL) {
			return await args.device.node.CommandClass.COMMAND_CLASS_SWITCH_MULTILEVEL.SWITCH_MULTILEVEL_START_LEVEL_CHANGE(startLevelChangeObj);
		}
		return Promise.reject('unknown_error');
	}

	async _actionStopDimLevelChangeRunListener(args, state) {

		args.device.log('FlowCardAction triggered to stop dim level change');

		if (args.device.node.CommandClass.COMMAND_CLASS_SWITCH_MULTILEVEL) {
			return await args.device.node.CommandClass.COMMAND_CLASS_SWITCH_MULTILEVEL.SWITCH_MULTILEVEL_STOP_LEVEL_CHANGE({});
		}
		return Promise.reject('unknown_error');
	}

2020-04-19 17:31:21 2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] ------------------------------------------
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] Node: 52
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] - Manufacturer id: 816
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] - ProductType id: 512
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] - Product id: 53261
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] - Firmware Version: 1.6
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] - Hardware Version: 1
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] - Firmware id: 262
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] - Secure: ⨯
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] - Battery: false
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] - DeviceClassBasic: BASIC_TYPE_ROUTING_SLAVE
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] - DeviceClassGeneric: GENERIC_TYPE_SWITCH_MULTILEVEL
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] - DeviceClassSpecific: SPECIFIC_TYPE_CLASS_C_MOTOR_CONTROL
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] - Token: 2cdd3176-a48b-4015-beff-8b6843845c73
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] - CommandClass: COMMAND_CLASS_ZWAVEPLUS_INFO
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Version: 2
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Commands:
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- ZWAVEPLUS_INFO_GET
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- ZWAVEPLUS_INFO_REPORT
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] - CommandClass: COMMAND_CLASS_TRANSPORT_SERVICE
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Version: 2
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Commands:
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- COMMAND_FIRST_SEGMENT
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- COMMAND_SEGMENT_COMPLETE
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- COMMAND_SEGMENT_REQUEST
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- COMMAND_SEGMENT_WAIT
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- COMMAND_SUBSEQUENT_SEGMENT
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] - CommandClass: COMMAND_CLASS_SECURITY
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Version: 1
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Commands:
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- NETWORK_KEY_SET
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- NETWORK_KEY_VERIFY
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SECURITY_COMMANDS_SUPPORTED_GET
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SECURITY_COMMANDS_SUPPORTED_REPORT
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SECURITY_MESSAGE_ENCAPSULATION
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SECURITY_MESSAGE_ENCAPSULATION_NONCE_GET
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SECURITY_NONCE_GET
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SECURITY_NONCE_REPORT
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SECURITY_SCHEME_GET
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SECURITY_SCHEME_INHERIT
2020-04-22 10:16:53 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SECURITY_SCHEME_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] - CommandClass: COMMAND_CLASS_SECURITY_2
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Version: 1
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Commands:
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SECURITY_2_NONCE_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SECURITY_2_NONCE_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SECURITY_2_MESSAGE_ENCAPSULATION
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- KEX_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- KEX_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- KEX_SET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- KEX_FAIL
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- PUBLIC_KEY_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SECURITY_2_NETWORK_KEY_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SECURITY_2_NETWORK_KEY_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SECURITY_2_NETWORK_KEY_VERIFY
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SECURITY_2_TRANSFER_END
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SECURITY_2_COMMANDS_SUPPORTED_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SECURITY_2_COMMANDS_SUPPORTED_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SECURITY_2_CAPABILITIES_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SECURITY_2_CAPABILITIES_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] - CommandClass: COMMAND_CLASS_SUPERVISION
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Version: 1
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Commands:
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SUPERVISION_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SUPERVISION_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] - CommandClass: COMMAND_CLASS_SWITCH_BINARY
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Version: 1
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Commands:
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SWITCH_BINARY_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SWITCH_BINARY_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SWITCH_BINARY_SET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] - CommandClass: COMMAND_CLASS_SWITCH_MULTILEVEL
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Version: 4
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Commands:
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SWITCH_MULTILEVEL_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SWITCH_MULTILEVEL_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SWITCH_MULTILEVEL_SET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SWITCH_MULTILEVEL_START_LEVEL_CHANGE
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SWITCH_MULTILEVEL_STOP_LEVEL_CHANGE
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SWITCH_MULTILEVEL_SUPPORTED_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SWITCH_MULTILEVEL_SUPPORTED_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] - CommandClass: COMMAND_CLASS_ASSOCIATION
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Version: 2
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Commands:
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- ASSOCIATION_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- ASSOCIATION_GROUPINGS_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- ASSOCIATION_GROUPINGS_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- ASSOCIATION_REMOVE
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- ASSOCIATION_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- ASSOCIATION_SET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- ASSOCIATION_SPECIFIC_GROUP_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- ASSOCIATION_SPECIFIC_GROUP_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] - CommandClass: COMMAND_CLASS_MULTI_CHANNEL_ASSOCIATION
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Version: 1
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Commands:
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] - CommandClass: COMMAND_CLASS_ASSOCIATION_GRP_INFO
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Version: 1
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Commands:
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- ASSOCIATION_GROUP_NAME_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- ASSOCIATION_GROUP_NAME_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- ASSOCIATION_GROUP_INFO_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- ASSOCIATION_GROUP_INFO_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- ASSOCIATION_GROUP_COMMAND_LIST_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- ASSOCIATION_GROUP_COMMAND_LIST_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] - CommandClass: COMMAND_CLASS_VERSION
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Version: 3
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Commands:
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- VERSION_COMMAND_CLASS_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- VERSION_COMMAND_CLASS_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- VERSION_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- VERSION_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- VERSION_CAPABILITIES_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- VERSION_CAPABILITIES_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- VERSION_ZWAVE_SOFTWARE_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- VERSION_ZWAVE_SOFTWARE_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] - CommandClass: COMMAND_CLASS_MANUFACTURER_SPECIFIC
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Version: 2
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Commands:
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- MANUFACTURER_SPECIFIC_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- MANUFACTURER_SPECIFIC_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- DEVICE_SPECIFIC_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- DEVICE_SPECIFIC_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] - CommandClass: COMMAND_CLASS_DEVICE_RESET_LOCALLY
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Version: 1
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Commands:
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- DEVICE_RESET_LOCALLY_NOTIFICATION
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] - CommandClass: COMMAND_CLASS_POWERLEVEL
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Version: 1
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Commands:
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- POWERLEVEL_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- POWERLEVEL_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- POWERLEVEL_SET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- POWERLEVEL_TEST_NODE_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- POWERLEVEL_TEST_NODE_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- POWERLEVEL_TEST_NODE_SET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] - CommandClass: COMMAND_CLASS_CONFIGURATION
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Version: 1
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Commands:
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- CONFIGURATION_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- CONFIGURATION_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- CONFIGURATION_SET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] - CommandClass: COMMAND_CLASS_NOTIFICATION
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Version: 3
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Commands:
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- NOTIFICATION_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- NOTIFICATION_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- NOTIFICATION_SET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- NOTIFICATION_SUPPORTED_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- NOTIFICATION_SUPPORTED_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- EVENT_SUPPORTED_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- EVENT_SUPPORTED_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] - CommandClass: COMMAND_CLASS_METER
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Version: 3
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Commands:
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- METER_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- METER_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- METER_RESET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- METER_SUPPORTED_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- METER_SUPPORTED_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] - CommandClass: COMMAND_CLASS_MULTI_CHANNEL
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Version: 1
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Commands:
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] - CommandClass: COMMAND_CLASS_SCENE_ACTIVATION
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Version: 1
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Commands:
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SCENE_ACTIVATION_SET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] - CommandClass: COMMAND_CLASS_SCENE_ACTUATOR_CONF
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Version: 1
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Commands:
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SCENE_ACTUATOR_CONF_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SCENE_ACTUATOR_CONF_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- SCENE_ACTUATOR_CONF_SET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] - CommandClass: COMMAND_CLASS_CENTRAL_SCENE
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Version: 3
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Commands:
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- CENTRAL_SCENE_SUPPORTED_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- CENTRAL_SCENE_SUPPORTED_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- CENTRAL_SCENE_NOTIFICATION
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- CENTRAL_SCENE_CONFIGURATION_SET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- CENTRAL_SCENE_CONFIGURATION_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- CENTRAL_SCENE_CONFIGURATION_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] - CommandClass: COMMAND_CLASS_FIRMWARE_UPDATE_MD
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Version: 4
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Commands:
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- FIRMWARE_MD_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- FIRMWARE_MD_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- FIRMWARE_UPDATE_MD_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- FIRMWARE_UPDATE_MD_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- FIRMWARE_UPDATE_MD_REQUEST_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- FIRMWARE_UPDATE_MD_REQUEST_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- FIRMWARE_UPDATE_MD_STATUS_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- FIRMWARE_UPDATE_ACTIVATION_SET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- FIRMWARE_UPDATE_ACTIVATION_STATUS_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] - CommandClass: COMMAND_CLASS_BASIC
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Version: 1
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] -- Commands:
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- BASIC_GET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- BASIC_REPORT
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] --- BASIC_SET
2020-04-22 10:16:54 [log] [ManagerDrivers] [ZW_CurtainController] [0] ------------------------------------------

*/

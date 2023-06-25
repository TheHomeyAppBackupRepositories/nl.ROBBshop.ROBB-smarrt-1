'use strict'

const { Driver } = require('homey')

class ZB_ThermstateDriver extends Driver {

  /**
   * onInit is called when the driver is initialized.
   */
   async onInit () {

     this.triggerThermostatModeChangedTo = this.homey.flow
       .getDeviceTriggerCard('thermostat_mode_changed_to');
     this.triggerThermostatModeChangedTo
       .registerRunListener((args, state) => Promise.resolve(args.mode === state.mode));

     this.actionThermostatModeChangedTo = this.homey.flow
         .getActionCard('thermostat_change_mode');
     this.actionThermostatModeChangedTo
       .registerRunListener(this.actionThermostatModeChangedToRunListener.bind(this));
   }

   async actionThermostatModeChangedToRunListener(args, state) {
     this.log('Setting new Thermostat mode to', args.mode);
     try {
       args.device.log('FlowCardAction triggered for ', args.device.getName(), 'to change Thermostat mode to', args.mode);
       await args.device.executeCapabilitySetCommand('thermostat_mode_custom', 'THERMOSTAT_MODE', args.mode);
     } catch (error) {
         throw new Error('Unable to set new Thermostat mode', error);
     }
   }

}

module.exports = ZB_ThermstateDriver

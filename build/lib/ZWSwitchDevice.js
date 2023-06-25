'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

module.exports = class ZWDimmerDevice extends ZwaveDevice {

  async onNodeInit({ node }) {
    if (this.hasCapability('onoff')) {
      this.registerCapability('onoff', 'SWITCH_BINARY');

      this.registerReportListener('BASIC', 'BASIC_REPORT', report => {
        // BASIC_REPORT V1
        if (report && report.hasOwnProperty('Value')) {
          if (this.hasCapability('onoff')) this.setCapabilityValue('onoff', report['Value'] > 0);
        }
        // BASIC_REPORT V2
        if (report && report.hasOwnProperty('Current Value')) {
          if (this.hasCapability('onoff')) this.setCapabilityValue('onoff', report['Current Value'] > 0);
        }
      });
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

    // remove the measure_voltage and measure_current capabilities
    if (this.hasCapability('measure_voltage')) {
      await this.removeCapability('measure_voltage').catch(this.error);
      this.log('removed capability measure_voltage');
    }

    if (this.hasCapability('measure_current')) {
      await this.removeCapability('measure_current').catch(this.error);
      this.log('removed capability measure_current');
    }
  }

};

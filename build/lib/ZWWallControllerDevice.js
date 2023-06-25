'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

const lastKey = null;

module.exports = class ZWWallControllerDevice extends ZwaveDevice {

  async onNodeInit({ node }) {
    // register device capabilities
    this.registerCapability('alarm_battery', 'BATTERY');
    this.registerCapability('measure_battery', 'BATTERY');

    // register a report listener (SDK2 style not yet operational)
    this.registerReportListener('CENTRAL_SCENE', 'CENTRAL_SCENE_NOTIFICATION', report => {
      if (report.hasOwnProperty('Properties1')
        && report.Properties1.hasOwnProperty('Key Attributes')
        && report.hasOwnProperty('Scene Number')
        && report.hasOwnProperty('Sequence Number')) {
        const remoteValue = {
          button: this.buttonMap[report['Scene Number'].toString()],
          scene: this.sceneMap[report.Properties1['Key Attributes'].toString()],
        };

        this.log('Triggering sequence:', report['Sequence Number'], 'remoteValue', remoteValue);

        // Trigger the trigger card with 2 dropdown option
        this.homey.app.triggerWallController_scene
          .trigger(this, null, remoteValue)
          .catch(this.error);
        // this.triggerFlow({
        //  id: 'wall_controller_scene',
        //  tokens: null,
        //  state: remoteValue,
        // })
        //  .catch(err => this.error('Error triggering wall_controller_scene', err));

        // Trigger the trigger card with tokens
        this.homey.app.triggerWallController_button
          .trigger(this, remoteValue, null)
          .catch(this.error);
        // this.triggerFlow({
        //  id: 'wall_controller_button',
        //  tokens: remoteValue,
        //  state: null,
        // })
        //  .catch(err => this.error('Error triggering wall_controller_button', err));
      }
    });
  }

  onSceneAutocomplete(query, args, callback) {
    let resultArray = [];
    for (const sceneID in this.sceneMap) {
      resultArray.push({
        id: this.sceneMap[sceneID],
        name: this.homey.__(this.sceneMap[sceneID]),
      });
    }
    // filter for query
    resultArray = resultArray.filter(result => {
      return result.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
    });
    this.log(resultArray);
    return Promise.resolve(resultArray);
  }

  onButtonAutocomplete(query, args, callback) {
    let resultArray = [];
    for (const sceneID in this.buttonMap) {
      resultArray.push({
        id: this.buttonMap[sceneID],
        name: this.homey.__(this.buttonMap[sceneID]),
      });
    }

    // filter for query
    resultArray = resultArray.filter(result => {
      return result.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
    });
    this.log(resultArray);
    return Promise.resolve(resultArray);
  }

};

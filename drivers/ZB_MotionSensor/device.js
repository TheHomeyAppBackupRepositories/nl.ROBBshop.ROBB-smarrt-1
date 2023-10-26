'use strict'

const { ZigBeeDevice, Util } = require('homey-zigbeedriver')

const { debug, CLUSTER, Cluster } = require('zigbee-clusters')
const ROBBSpecificOccupancySensingCluster = require('../../lib/Clusters/ROBBSpecificOccupancySensingCluster')
const ROBBSpecificTemperatureMeasurementCluster = require('../../lib/Clusters/ROBBSpecificTemperatureMeasurementCluster')
const ROBBSpecificRelativeHumidityCluster = require('../../lib/Clusters/ROBBSpecificRelativeHumidityCluster')

/*
    1030, 0x0406, Occupancy Sensing, endpoint 1
    1280, 0x0500, IAS Zone, endpoint 2
    1026, 0x0402, Temperature Sensor, endpoint 3, 1 degree, min 2, max 600
    1029, 0x0405, Humidity, endpoint 4, 1 %, min 2, max 600
    1024, 0x0400, Illuminance, endpoint 5, 1 , min 2, max 600
 */

module.exports = class ZB_MotionSensor extends ZigBeeDevice {

  async onNodeInit({ zclNode }) {

    // Mark device as unavailable while configuring
    this.setUnavailable(this.homey.__('pairing.configuring')).catch(this.error);

    // Enables debug logging in zigbee-clusters
    // debug(true);

    // enable debugging
    // this.enableDebug();

    // print the node's info to the console
    // this.printNode();

    if (this.hasCapability('alarm_battery')) {
        this.registerCapability('alarm_battery', CLUSTER.POWER_CONFIGURATION)
      }

      if (this.hasCapability('measure_battery')) {
        this.registerCapability('measure_battery', CLUSTER.POWER_CONFIGURATION)
      }

      if (this.hasCapability('alarm_motion')) {
        this.registerCapability('alarm_motion', CLUSTER.OCCUPANCY_SENSING, {
          get: 'occupancy',
          report: 'occupancy',
          reportParser (value) {
            const newValue = value['occupied']
            if (typeof newValue === 'boolean') { return newValue }
            return false
          },
        })
      }

      if (this.hasCapability('measure_temperature')) {
        this.registerCapability('measure_temperature',
          CLUSTER.TEMPERATURE_MEASUREMENT)
      }

      if (this.hasCapability('measure_humidity')) {
        this.registerCapability('measure_humidity',
          CLUSTER.RELATIVE_HUMIDITY_MEASUREMENT)
      }

      if (this.hasCapability('measure_luminance')) {
        this.registerCapability('measure_luminance',
          CLUSTER.ILLUMINANCE_MEASUREMENT, {
            reportOpts: {
            //  configureAttributeReporting: {
            //    minInterval: 3600, // Minimally once every hour
            //    maxInterval: 60000, // Maximally once every ~16 hours
            //    minChange: 1,
            //  },
            },
          })
      }

    // register a settings parser
    // this.registerSetting('motion_sensor_blindtime', value => new Buffer([(value / 0.5) - 1]));
    // this.registerSetting('basic_on_command', value => new Buffer([value > 100 ? 255 : value]));
    // this.registerSetting('basic_off_command', value => new Buffer([value > 100 ? 255 : value]));
    // this.registerSetting('reporting_threshold_temperature', value => value * 10);
    // this.registerSetting('sensor_compensation_temperature', value => new Buffer([value * 10]));

    // Finally device is ready to be used, mark as available
    this.setAvailable().catch(this.error);
  }

  async onSettings({ oldSettings, newSettings, changedKeys }) {

    this.configureAttributeReportingArray =[];

    if (changedKeys.includes('motion_sensor_sensitivity')) {
      await Util.wrapAsyncWithRetry(() => this.zclNode.endpoints[this.getClusterEndpoint(ROBBSpecificOccupancySensingCluster)].clusters[ROBBSpecificOccupancySensingCluster.NAME]
        .writeAttributes({ PIRSensorSensitivity: newSettings.motion_sensor_sensitivity }), 3)
        .then(this.log('SETTINGS | Write Attribute - Robb Specific Occupancy Cluster - PIRSensorSensitivity', newSettings.motion_sensor_sensitivity))
        .catch(this.error);
      //const result = await this.zclNode.endpoints[this.getClusterEndpoint(ROBBSpecificOccupancySensingCluster)].clusters[ROBBSpecificOccupancySensingCluster.NAME]
      //  .writeAttributes({ PIRSensorSensitivity: newSettings.motion_sensor_sensitivity }).catch(this.error);

    }

    if (changedKeys.includes('motion_sensor_blindtime')) {
      await Util.wrapAsyncWithRetry(() => this.zclNode.endpoints[this.getClusterEndpoint(ROBBSpecificOccupancySensingCluster)].clusters[ROBBSpecificOccupancySensingCluster.NAME]
        .writeAttributes({ motionDetectionBlindTime: newSettings.motion_sensor_blindtime }), 3)
        .then(this.log('SETTINGS | Write Attribute - Robb Specific Occupancy Cluster - motionDetectionBlindTime', newSettings.motion_sensor_blindtime))
        .catch(this.error);
    }

    if (changedKeys.includes('motion_sensor_cancellation_delay')) {
      await Util.wrapAsyncWithRetry(() => this.zclNode.endpoints[this.getClusterEndpoint(ROBBSpecificOccupancySensingCluster)].clusters[ROBBSpecificOccupancySensingCluster.NAME]
        .writeAttributes({ pirOccupiedToUnoccupiedDelay: newSettings.motion_sensor_cancellation_delay }), 3)
        .then(this.log('SETTINGS | Write Attribute - Robb Specific Occupancy Cluster - pirOccupiedToUnoccupiedDelay', newSettings.motion_sensor_cancellation_delay))
        .catch(this.error);
    }

    if (changedKeys.includes('sensor_compensation_temperature')) {
      await Util.wrapAsyncWithRetry(() => this.zclNode.endpoints[this.getClusterEndpoint(ROBBSpecificTemperatureMeasurementCluster)].clusters[ROBBSpecificTemperatureMeasurementCluster.NAME]
        .writeAttributes({ temperatureSensorCompensation: newSettings.sensor_compensation_temperature }), 3)
        .then(this.log('SETTINGS | Write Attribute - Robb Specific Temperature Cluster - temperatureSensorCompensation', newSettings.sensor_compensation_temperature))
        .catch(this.error);
    }

    if (changedKeys.includes('sensor_compensation_humidity')) {
      await Util.wrapAsyncWithRetry(() => this.zclNode.endpoints[this.getClusterEndpoint(ROBBSpecificRelativeHumidityCluster)].clusters[ROBBSpecificRelativeHumidityCluster.NAME]
        .writeAttributes({ humiditySensorCompensation: newSettings.sensor_compensation_humidity }), 3)
        .then(this.log('SETTINGS | Write Attribute - Robb Specific Temperature Cluster - humiditySensorCompensation', newSettings.sensor_compensation_humidity))
        .catch(this.error);

    }

    if (changedKeys.includes('reporting_interval_temperature') || changedKeys.includes('reporting_threshold_temperature') ) {
      const reportingInterval = changedKeys.includes('reporting_interval_temperature')? newSettings.reporting_interval_temperature : this.getSetting('reporting_interval_temperature');
      const reportingThreshold = changedKeys.includes('reporting_threshold_temperature')? newSettings.reporting_threshold_temperature : this.getSetting('reporting_threshold_temperature');
      this.configureAttributeReportingArray.push({
        endpointId: this.getClusterEndpoint(ROBBSpecificTemperatureMeasurementCluster),
        cluster: ROBBSpecificTemperatureMeasurementCluster,
        attributeName: 'measuredValue',
        minInterval: 1,
        maxInterval: reportingInterval,
        minChange: reportingThreshold,
      });
      this.log('SETTINGS | Configure Attribute Reporting - Robb Specific Temperature Cluster - measuredValue (reportingInterval, reportingThreshold)', reportingInterval, reportingThreshold);
    }

    if (changedKeys.includes('reporting_interval_luminance') || changedKeys.includes('reporting_threshold_luminance') ) {
      const reportingInterval = changedKeys.includes('reporting_interval_luminance')? newSettings.reporting_interval_luminance : this.getSetting('reporting_interval_luminance');
      const reportingThreshold = changedKeys.includes('reporting_threshold_luminance')? newSettings.reporting_threshold_luminance : this.getSetting('reporting_threshold_luminance');
      this.configureAttributeReportingArray.push({
        endpointId: this.getClusterEndpoint(CLUSTER.ILLUMINANCE_MEASUREMENT),
        cluster: CLUSTER.ILLUMINANCE_MEASUREMENT,
        attributeName: 'measuredValue',
        minInterval: 1,
        maxInterval: reportingInterval,
        minChange: reportingThreshold,
      });
      this.log('SETTINGS | Configure Attribute Reporting - Illuminance Measurement Cluster - measuredValue (reportingInterval, reportingThreshold)', reportingInterval, reportingThreshold);
    }

    if (changedKeys.includes('reporting_interval_humidity') || changedKeys.includes('reporting_threshold_humidity') ) {
      const reportingInterval = changedKeys.includes('reporting_interval_humidity')? newSettings.reporting_interval_humidity : this.getSetting('reporting_interval_humidity');
      const reportingThreshold = changedKeys.includes('reporting_threshold_humidity')? newSettings.reporting_threshold_humidity : this.getSetting('reporting_threshold_humidity');
      this.configureAttributeReportingArray.push({
        endpointId: this.getClusterEndpoint(ROBBSpecificTemperatureMeasurementCluster),
        cluster: ROBBSpecificTemperatureMeasurementCluster,
        attributeName: 'measuredValue',
        minInterval: 1,
        maxInterval: reportingInterval,
        minChange: reportingThreshold,
      });
      this.log('SETTINGS | Configure Attribute Reporting - Robb Specific Humidity Cluster - measuredValue (reportingInterval, reportingThreshold)', reportingInterval, reportingThreshold);
    }

    if (this.configureAttributeReportingArray.length > 0) {
      await this.configureAttributeReporting(this.configureAttributeReportingArray)
      .then(this.log('SETTINGS | Configure Attribute Reporting', this.configureAttributeReportingArray))
      .catch(this.error);
    }

  }

};

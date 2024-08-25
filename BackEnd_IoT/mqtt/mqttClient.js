const mqtt = require('mqtt');

// const mqttClient = mqtt.connect('mqtt://broker.hivemq.com');
const mqttClient = mqtt.connect('mqtt://test.mosquitto.org');

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    mqttClient.subscribe('sensor/data', (err) => {
      if (err) {
        console.error('Failed to subscribe to topic');
      }
    });
    mqttClient.subscribe('iot/fan/status', (err) => {
      if (err) {
        console.error('Failed to subscribe to topic led');
      }
    });
    mqttClient.subscribe('iot/air/status', (err) => {
      if (err) {
        console.error('Failed to subscribe to topic air');
      }
    });
    mqttClient.subscribe('iot/lamp/status', (err) => {
      if (err) {
        console.error('Failed to subscribe to topic fridge');
      }
    });
});

module.exports = mqttClient;
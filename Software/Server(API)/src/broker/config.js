const Lockreport = require('../models/lockreports')

const mqtt = require('mqtt');
const brokerUrl = 'mqtt://redacted.cloud.shiftr.io';  // MQTT broker URL
const token = 'redacted';      // MQTT token

const mqttoptions = {
  clientId: 'redacted',   // A unique client identifier
  clean: true,                       // Set to true to start a clean session
  username: 'redacted',        // MQTT broker username 
  password: token,                 // MQTT broker password (my token)
  port: 1883,                     // Specify the MQTT port here
};

const setupMqttClient = async () => {
  const options = mqttoptions

  const client = mqtt.connect(brokerUrl, options);

  client.on('connect', (connack) => {
    if (connack.returnCode === 0) {
      console.log('Connected to MQTT broker');
      
      // Subscribe to topics

      // Subscribe to the ACK/NACK topic
      client.subscribe('lock-acknowledgments', (err) => {
        if (!err) {
          console.log('Subscribed to lock-acknowledgments topic successfully');
        } else {
          console.error('Error subscribing to lock-acknowledgments topic:', err);
        }
      });
      
      // Handle incoming "abrir" or "cerrar" messages from the app
      client.subscribe('app-command', (err) => {
        if (!err) {
          console.log('Subscribed to app-command topic successfully');
        } else {
          console.error('Error subscribing to app-command topic:', err);
        }
      });
    } else {
      console.error('Error connecting to MQTT broker. Return code:', connack.returnCode);   // HASTA ACA ANDA
    }
  });


  client.on('error', (error) => {
    console.error('MQTT error:', error);
    // Handle MQTT connection errors here
  });

  client.on('offline', () => {
    console.log('MQTT client is offline. Please wait or reset the system after a while.');
    // Handle MQTT client going offline
  });

  // When you're done with the MQTT connection (e.g., when the server shuts down):
  // client.end();
};

module.exports = {
  setupMqttClient,
  brokerUrl,
  mqttoptions
  
};

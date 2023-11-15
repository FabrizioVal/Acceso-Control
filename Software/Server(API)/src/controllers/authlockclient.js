const mqtt = require('mqtt');
const { brokerUrl, mqttoptions } = require('../broker/config'); // Import the MQTT configuration

const Lock = require('../models/lock');
const Lockreport = require('../models/lockreports');

const client = mqtt.connect(brokerUrl, mqttoptions);

// let ackMessage = null; // Declare ackMessage in a higher scope

// Lock processes here

// Set up the event listener for 'lock-acknowledgments' outside the function
const waitForAckMessage = () => {
  console.log("waitforackmsg function start");

  return new Promise((resolve) => {
    // Ensure that you subscribe to the topic when the MQTT client is connected
    if (!client.connected) {
      // Wait for the client to connect
      client.on('connect', () => {
        client.subscribe('lock-acknowledgments', (err) => {
          if (!err) {
            console.log("Client subscribed to 'lock-acknowledgments'");
          } else {
            console.error('Error subscribing to topic:', err);
          }
        });
      });
    } else {
      // If the client is already connected, subscribe to the topic
      client.subscribe('lock-acknowledgments', (err) => {
        if (!err) {
          console.log("Client subscribed to 'lock-acknowledgments'");
        } else {
          console.error('Error subscribing to topic:', err);
        }
      });
    }

    // Listen for acknowledgment message (ACK/NACK) from the lock
    client.on('message', (topic, message) => {
      console.log(`Received message from topic '${topic}': '${message}'`);

      if (topic === 'lock-acknowledgments') {
        if (message === 'CERROJO CERRADO - ESP32' || message === 'CERROJO ABIERTO - ESP32') {
          console.log(`Received valid status message: ${message}`);
          resolve(message);
        } else {
          console.log(`Received an invalid message: ${message}`);
          // Handle the case of an invalid message if necessary
          resolve(message);
        }
      }
    });
  });
};


const lockreport = async (req, res) => {
  const { email, action, serialname } = req.body; // received data from the app

console.log("lockreport start")

    try{

      client.publish('app-command', `${action} ${serialname}`, (err) => {
        if (!err) {
          console.log(`Published action '${action}' to estado topic and serial name '${serialname}'`);
        } else {
          console.error('Error publishing action to estado topic:', err);
        }
      });

      // Wait for acknowledgment message from the lock
     
    const ackMessageResult = (await waitForAckMessage()).toString();// ANDO AL PONER ".TOSTRING" PERO NO ME IDENTIFICA EL STATUS. NUNCA ENVIE ACK O NACK

    console.log("Received ACK message from lock: " + ackMessageResult);

 // Create a new Lockreport document with the initial data
  const newLockreport = new Lockreport({

  email,
  action,
  serialname,
  time: new Date(), //Set to the current time
  status: ackMessageResult, // Set the status based on ackMessage
});

// Save the new Lockreport document to the database (THIS NEEDS TO BE DONE AFTER I GIVE THE TIME OF THE REPORT)
await newLockreport.save();

console.log('Lock report stored successfully');
  
  // Send a response to the app (request received)
  return res.status(200).json({
    success: true,
    message: 'Lock Report has been successfully stored',
  });

} catch (error) {
    console.error('An error has occurred:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    });
  }
};

module.exports = {
  lockreport,
  
};

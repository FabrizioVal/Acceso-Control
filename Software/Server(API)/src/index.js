
const http = require('http');

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const {ConnectDB} = require('./database/config')
const {setupMqttClient} = require('./broker/config')

// Express server creation

const app = express();

const PORT = process.env.PORT || 3000; //If there is another port provided, use that one. Otherwise, use the default one (3000)
app.set('json spaces', 2);

const server = http.createServer(app) //Create server

// Middlewares

app.use(morgan('dev'));
app.use(express.urlencoded({extended:false})); // We wont work with big files so we use this extension
app.use(express.json());

// Routes

app.use('/api/auth', require ('./routes/auth')); 

// Show which port the server is running in

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await ConnectDB();
  await setupMqttClient();

}); 

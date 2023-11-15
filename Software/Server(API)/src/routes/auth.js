const express = require("express");
const router = express.Router();
module.exports = router; //Export the router instance

// This section is for receiving authorization petitions

// Login function routing

const { login } = require('../controllers/authapps') 

router.post('/signin', login);

// Register function routing

const { register } = require('../controllers/authapps')

router.post('/register', register);

// Forms function routing

const { uploadform } = require('../controllers/authapps')

router.post('/uploadform', uploadform);

// Lock reports routing

const {lockreport} = require('../controllers/authlockclient')

router.post('/lockreport', lockreport);
// Define a schema and model

const { Schema, model } = require("mongoose");

//Lock model

const LockSchema = Schema({
  SerialName: {
    type: String,
    required: true,
  }
});

//Models exportation

module.exports = model('lock', LockSchema) 

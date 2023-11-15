// Define a schema and model

const { Schema, model } = require("mongoose");

//User model

const UserSchema = Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
   additionalData: {
    type: String,
    required: true,
  }
});

//Models exportation

module.exports = model('user', UserSchema) 
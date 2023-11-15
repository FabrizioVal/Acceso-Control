
// Define a schema and model

const { Schema, model } = require("mongoose");

//LockReport model

const LockReportSchema = Schema({
  email: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
   time: {
    type: String,
    required: true,
  },
   serialname: {
    type: String,
    required: true,
   },
   status: {
    type: String,
    required: true,
   }
});

//Models exportation

module.exports = model('lockreport', LockReportSchema) 

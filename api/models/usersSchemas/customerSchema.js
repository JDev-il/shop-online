var mongoose = require('../../services/mongoose')

var Schema = mongoose.Schema;

var CustomerSchema = new Schema({
  firstname: {type: String},
  lastname: {type: String},
  idnumber: {type: String},
  email: {type: String},
  password: {type: String},
  city: {type: String},
  street: {type: String},
  customer: {type: Boolean}
});


module.exports = mongoose.model('Customer', CustomerSchema );

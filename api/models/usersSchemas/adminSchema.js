var mongoose = require('../../services/mongoose')

var Schema = mongoose.Schema;

var AdminSchema = new Schema({
  firstname: {type: String},
  lastname: {type: String},
  idnumber: {type: String},
  email: {type: String},
  password: {type: String},
  customer: {type: Boolean}
});


module.exports = mongoose.model('Admin', AdminSchema );

var mongoose = require('../../services/mongoose')

var Schema = mongoose.Schema;

var CartSchema = new Schema({
  customer_id: { type: Schema.Types.ObjectId, ref: 'Customer' },
  date_created: { type: Date }
});


module.exports = mongoose.model('Cart', CartSchema );

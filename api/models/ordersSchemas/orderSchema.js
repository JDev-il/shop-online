var mongoose = require('../../services/mongoose')

var Schema = mongoose.Schema;

var OrderSchema = new Schema({
  customer_id: { type: Schema.Types.ObjectId, ref: 'Customer' },
  cart_id: { type: Schema.Types.ObjectId, ref: 'Cart' },
  total_price: { type: Number },
  shipping_address: { 
    city: String,
    street: String, 
  },
  shipping_date: { type: Date },
  order_date: { type: Date },
  cd_4_last_digits: { type: Number }
});


module.exports = mongoose.model('Order', OrderSchema );

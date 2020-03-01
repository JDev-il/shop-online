var mongoose = require('../../services/mongoose')

var Schema = mongoose.Schema;


var ItemSchema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number },
  total_price: { type: Number },
  cart_id: { type: Schema.Types.ObjectId, ref: 'Cart' },
});


module.exports = mongoose.model('Item', ItemSchema );

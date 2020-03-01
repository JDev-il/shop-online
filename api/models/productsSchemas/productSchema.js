var mongoose = require('../../services/mongoose')

var Schema = mongoose.Schema;

var ProductSchema = new Schema({
  productName: { type: String },
  category_id: { type: Schema.Types.ObjectId, ref: 'Category' },
  price: { type: String },
  //Consider Changing//
  product_img: { type: String },
  //Consider Changing//
});


module.exports = mongoose.model('Product', ProductSchema );

var mongoose = require('../../services/mongoose')

var Schema = mongoose.Schema;

var CategorySchema = new Schema({
  category: { type: String }
});


module.exports = mongoose.model('Category', CategorySchema);

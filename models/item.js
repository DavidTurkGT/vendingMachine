const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema( {
  description: { type: String, required: true, trim: true},
  cost: { type: Number, required: true, default: 0},
  quantity: { type: Number, required: true, default: 1}
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
  item: { type: String, required: true, trim: true},
  cost: { type: Number, required: true, default: 0 }
});

const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;

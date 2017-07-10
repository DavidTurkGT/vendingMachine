const express       = require('express');
const router        = express.Router();
const Item          = require('../models/item');
////////////////////////////////////////////////////////////////////////////////

router.get('/items', async (req, res) => {
  //TODO Get a list of items
  let items = await Item.find({})
    .catch( (err) => res.status(500).send("Internal server error"));
  res.setHeader('Content-Type','application/json');
  res.status(200).json(items);
});

router.post('/items/:itemID/purchases', async (req, res) => {
  //TODO Purchase an item
  let item = await Item.findbyId(req.params.itemID)
    .catch( (err) => res.status(400).send("Error: bad request"))
  if(!item) res.status(404).send("Error: no such item");
  item.quantity--;
  item = await item.save();
  res.status(200).send("Successfully bought: " + item.description + ". There are now " + item.quantity + " left");
});

module.exports = router;

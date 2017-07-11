const express       = require('express');
const router        = express.Router();
const Item          = require('../models/item');
////////////////////////////////////////////////////////////////////////////////

router.get('/items', async (req, res) => {
  //Get a list of items
  let items = await Item.find({})
    .catch( (err) => res.status(500).send("Internal server error"));
  res.setHeader('Content-Type','application/json');
  res.status(200).json(items);
});

router.post('/items/:itemID/purchases', (req, res) => {
  //TODO Purchase an item
  res.status(200).send("Not finished yet");
});

module.exports = router;

const express       = require('express');
const router        = express.Router();
////////////////////////////////////////////////////////////////////////////////

router.get('/items', (req, res) => {
  //TODO Get a list of items
  res.send("Get a list of items");
});

router.post('/items/:itemID/purchases', (req, res) => {
  //TODO Purchase an item
  res.send("Purchase an item");
});

module.exports = router;

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
  let customerMoney = req.body.money;
  let items = await Item.find({});
  console.log("Items in the db: ", items);
  console.log("Money received: ", customerMoney);
  console.log("Using ID: ", req.params.itemID);
  let item = await Item.find({ _id: req.params.itemID })
    .catch( (err) => res.status(400).send("Error: bad request"))
  if(!item) {
    res.status(404).send("Error: no such item");
  }
  else if( customerMoney > item.cost ){
    item.quantity--;
    item = await item.save();
    // res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      "data": {
        "message": "Successfully bought: " + item.description,
        "money given": customerMoney,
        "cost": item.cost,
        "change": customerMoney - item.cost,
        "quantity": item.quantity
      }
    });
  }
  else{
    // res.setHeader('Content-Type','application/json');
    res.status(400).json({
      "data": {
        "Message": "Error: not enough money",
        "Money Given": customerMoney,
        "Cost": item.cost
      }
    })
  }
});

module.exports = router;

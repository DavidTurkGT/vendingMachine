const express     = require('express');
const router      = express.Router();
const Item        = require('../models/item');
const Purchase    = require('../models/purchase');
////////////////////////////////////////////////////////////////////////////////

router.get('/purchases', async (req, res) => {
  //Get a list of all puchases with their item and date/time
  let purchases = await Purchase.find({})
    .catch( (err) => res.status(500).send("Internal server error"));
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.status(200).json({"purchases": purchases});
});

router.get("/money", async (req, res) => {
  //Get a total amount of money accepted by the machine
  let purchases = await Purchase.find({})
    .catch( (err) => res.status(500).send("Internal server error"));
  let money = 0;
  purchases.forEach( (purchase) => money+=purchase.cost );
  res.setHeader('Content-Type','application/json');
  res.status(200).json({"money" : money});
});

router.post("/items", (req, res) => {
  //TODO Add a new item not previously exisiting in the machine
  Item.findOne({ description: req.description})
  .catch( (err) => res.status(400).send("Bad request: "+err) )
  .then( (item) => {
    if(item) res.status(401).send("Item already exisits");
    else{
      let newItem = {
        description: req.body.description,
        cost: req.body.cost,
        quantity: req.body.quantity
      };
      Item.create(newItem).then( (newItem) => {
        res.setHeader('Content-Type','application/json');
        res.status(200).json({"item": newItem});
      })
      .catch( (err) => res.status(500).send("Internal server error") );
    }
  })

});

router.put("/items/:itemID", (req, res) => {
  //Update item quantity, description, and cost
  Item.findById(req.params.itemID).then( (item) => {
    if(!item) res.status(404).send("Item not found");
    item.description = req.body.description || item.description;
    item.cost = req.body.cost || item.cost;
    item.quantity = req.body.quantity || item.quantity;
    item.save()
    .then( (item) => {
      res.setHeader('Content-Type','application/json');
      res.status(200).json({"item": item});
    })
    .catch( (err) => res.status(500).send("Internal server error"));
  })
  .catch( (err) => res.status(400).send("Bad request: "+err) );
});

module.exports = router;

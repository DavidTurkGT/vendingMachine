const express     = require('express');
const router      = express.Router();
const Item        = require('../models/item');
const Purchase    = require('../models/purchase');
////////////////////////////////////////////////////////////////////////////////

router.get('/purchases', async (req, res) => {
  //TODO Get a list of all puchases with their item and date/time
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
  res.send("Add a new item not previously exisiting in the machine");
});

router.put("/items/:itemID", (req, res) => {
  //TODO Update item quantity, description, and cost
  res.send("Update item quantity, description, and cost");
});

module.exports = router;

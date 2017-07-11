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
  //Purchase an item
  let customerMoney = req.body.money || -1;
  Item.findById(req.params.itemID).then( (item) => {
    if(!item) res.status(404).send("Error: no item found");
    else if(customerMoney >= item.cost){
      item.quantity--;
      let change = customerMoney - item.cost;
      item.save().then( (item) =>{
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.status(200).json({ "data": {
          "moneyReceived": customerMoney,
          "cost": item.cost,
          "change": change,
          "quantity": item.quantity
        } })
      })
      .catch( (err) => res.status(500).send("Serve error") );
    }
    else{

    }
  })
  .catch( (err) => res.status(400).send("Error: bad request"))
});

module.exports = router;

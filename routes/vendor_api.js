const express     = require('express');
const router      = express.Router();
////////////////////////////////////////////////////////////////////////////////

router.get('/purchases', (req, res) => {
  //TODO Get a list of all puchases with their item and date/time
  res.send("Get a list of all purchases with their itme and date/time");
});

router.get("/money", (req, res) => {
  //TODO Get a total amount of money accepted by the machine
  res.send("Get a total amount of money accepted by the machine");
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

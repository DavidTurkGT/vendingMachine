const express               = require('express');
const router                = express.Router();
const customerApiRouter     = require("./customer_api");
const vendorApiRouter       = require('./vendor_api');
////////////////////////////////////////////////////////////////////////////////

router.use('/api/customer', customerApiRouter);
router.use('/api/vendor', vendorApiRouter);

router.get('/', (req, res) => {
  res.send("You made it!");
});

module.exports = router;

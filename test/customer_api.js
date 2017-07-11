const assert = require('assert');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const config = require('../config')[process.env.NODE_ENV || "test"];
const request = require('supertest');
const Item = require('../models/item');
const Purchase = require('../models/purchase');
const app = require('../app');

let itemID;

before("Setting up...", (done) =>{
  mongoose.connect(config.mongoURL)
  .then( () =>{
  let twix = {
    description: "Twix",
    cost: 105,
    quantity: 19
  },
  snickers = {
    description: "Snickers",
    cost: 95,
    quantity: 3
  },
  chips = {
    description: "Lays",
    cost: 125,
    quantity: 13
  };
  Item.insertMany([twix, snickers, chips])
  .then( (data) => {
  console.log("First item: ", data[0]);
  itemID = data[0].id;
  done();
  })})
});

after("Cleaning up...", (done) => {
  mongoose.connection.dropDatabase(done);
});

describe("A customer", () => {

  it("should be able to get a list of the current items, their costs, and quantities of those items", (done) =>{
    request(app)
      .get("/api/customer/items")
      .expect(200)
      .expect('Content-Type','application/json; charset=utf-8')
      .expect( (res) =>{
        let items = res.body;
        assert(items);
        items.forEach( (item) => {
          assert(item);
          assert.notEqual(item.description, "");
          assert(item.cost);
          assert(item.quantity);
        });
      })
      .end(done);
  });

  it("should be able to buy an item using money", (done) => {
    request(app)
      .post("/api/customer/items/"+itemID+"/purchases")
      .expect(200)
      .expect('Content-Type','application/json; charset=utf-8')
      .expect( (res) => {
        assert(res.body.data.change >= 0);
        assert.isEqual(res.body.data.change, 200-105);
        assert(res.body.data.quantity > 0);
      })
      .end(done);
  });

  it("should be able to buy an item, paying more than the item is worth (imagine putting a dollar in a machine for a 65-cent item) and get correct change. This change is just an amount, not the actual coins.", (done) => {
      assert(false);
      done();
  });

  it("should not be able to buy items that are not in the machine, but instead get an error", (done) => {
    request(app)
      .post("/api/customer/items/20/purchases")
      .expect( (res) => {
        assert(res.status != 200);
      })
      .end(done);
  });

});

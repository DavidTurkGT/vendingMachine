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
        assert(items, "Array of items does not exist");
        items.forEach( (item) => {
          assert(item, "Item does not exist");
          assert.notEqual(item.description, "", "Item description is blank");
          assert(item.cost, "Item has no cost");
          assert(item.quantity, "Item has no qunatity");
        });
      })
      .end( (err, res) => {
        if(err) done(err);
        else done();
      });
  });

  it("should be able to buy an item using money", (done) => {
    let url = "/api/customer/items/"+itemID+"/purchases";
    request(app)
      .post(url)
      .send({"money": 200})
      .expect(200)
      .expect('Content-Type','application/json; charset=utf-8')
      .expect( (res) => {
        assert.equal(res.data.moneyReceived, 200, "Money received was not 200");
      })
      .end( (err, res) => {
        if(err) done(err);
        else done();
      });
  });

  it("should be able to buy an item, paying more than the item is worth (imagine putting a dollar in a machine for a 65-cent item) and get correct change. This change is just an amount, not the actual coins.", (done) => {
    let url = "/api/customer/items/"+itemID+"/purchases";
    request(app)
      .post(url)
      .send({"money": 200})
      .expect(200)
      .expect('Content-Type','application/json; charset=utf-8')
      .expect( (res) => {
        assert.equal(res.data.moneyReceived, 200, "Money was not 200");
        assert.equal(res.data.cost, 105, "Cost was not 105");
        assert.equal(res.data.change, 95, "Change was not 95");
      })
      .end( (err, res) => {
        if(err) done(err);
        else done();
      });
  });

  it("should not be able to buy items that are not in the machine, but instead get an error", (done) => {
    let url = "/api/customer/items/20/purchases";
    request(app)
      .post(url)
      .expect( (res) => {
        assert(res.status !== 200, "Status was 200 instead of not 200");
      })
      .end( (err, res) => {
        if(err) done(err);
        else done();
      });
  });

});

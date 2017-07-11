const assert = require('assert');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const request = require('supertest')
const config = require('../config')[process.env.NODE_ENV || "test"];
const app = require('../app');
const Item = require('../models/item');
const Purchase = require('../models/purchase');

before("Setting up...", (done) => {
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
    let purchase1 = {
      item: "Twix",
      cost: 105,
      date: new Date()
    },
    purchase2 = {
      item: "Snickers",
      cost: 95,
      date: new Date()
    },
    purchase3 = {
      item: "Twix",
      cost: 105,
      date: new Date()
    };
    Purchase.insertMany([purchase1, purchase2, purchase3])
    .then( (data) => {
      done();
    })
  })

});

after("Cleaning up...", (done) => {
  mongoose.connection.dropDatabase(done);
});

describe("A vendor", () => {

  it("should be able to see total amount of money in machine", (done) => {
    request(app)
      .get("/api/vendor/money")
      .expect(200)
      .expect('Content-Type','application/json; charset=utf-8')
      .expect( (res) => {
        assert(res, "No response sent");
        assert(res.body, "Response has no body");
        assert(res.body.money >= 0, "Money in machine is negative");
        assert.equal(res.body.money,305, "Incorrect money in machine")
      })
      .end( (err, res) => {
        if(err) done(err);
        else done();
      });
  });

  it("should be able to see a list of all purchases with their time of purchase", (done) => {
    request(app)
      .get("/api/vendor/purchases")
      .expect(200)
      .expect('Content-Type','application/json; charset=utf-8')
      .expect( (res) => {
        assert(res, "No response sent");
        assert(res.body, "No response body");
        assert(res.body.purchases, "No list of purchase received");
        res.body.purchases.forEach( (purchase) => {
          assert(purchase, "A purchase does not exist");
          assert(purchase.item !== "", "Purchased item is blank");
          assert(purchase.date, "No purchase date");
          assert(purchase.cost >= 0, "Purchase cost is negative");
        });
      })
      .end( (err, res) => {
        if(err) done(err);
        else done();
      });
  });

  it("should be able to update the description, quantity, and costs of items in the machine", (done) => {
    let newItem = {
      description: "Bag O' Crap",
      cost: 350,
      quantity: 9
    }
    Item.create(newItem).then( (item) => {
      request(app)
        .put("/api/vendor/items/"+item.id)
        .send({
          "cost": 200,
          "quantity": 10
        })
        .expect(200)
        .expect('Content-Type','application/json; charset=utf-8')
        .expect( (res) => {
          assert(res, "No response sent. Received: " + res);
          assert(res.body, "No response body received. Received: " + res.body);
          assert(res.body.item, "No item received. Received: " + res.body.item);
          assert.equal(res.body.item.description, "Bag O' Crap", "Item description changed when it shouldn't. Received: " + res.body.item.description);
          assert.equal(res.body.item.cost, 200, "Cost did not get modified. Received: " + res.body.item.cost);
          assert.equal(res.body.item.quantity, 10, "Quantity did not get modified. Received: " + res.body.item.quantity)
        })
        .end( (err, res) => {
          if(err) done(err);
          else done();
        })
    })
  });

  it("should be able to add a new item to the machine", (done) => {
    let newItem = {
      description: "Skittles",
      cost: 180,
      quantity: 19
    };
    Item.create(newItem).then( (item) => {
      request(app)
        .post("/api/vendor/items")
        .send(newItem)
        .expect(200)
        .expect('Content-Type','application/json; charset=utf-8')
        .expect( (res) => {
          assert(res, "No response received. Received: " + res);
          assert(res.body, "No response body. Received: " + res.body);
          assert(res.body.item, "No item received. Recevied: " + res.body.item);
          assert.equal(res.body.item.description, "Skittles", "Description is not 'Skittles'. Received: " + res.body.item.description);
          assert.equal(res.body.item.cost, 180, "Cost is not 180. Received: ", res.body.item.cost);
          assert.equal(res.body.item.quantity, 19, "Qunatity is not 19. Received: ", res.body.item.quantity);
        })
        .end( (err, res) => {
          if(err) done(err);
          else done();
        })
    })
  });

});

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
        assert(res);
        assert(res.body);
        assert(res.body.money >= 0);
        assert.equal(res.body.money,305)
      })
      .end(done);
  });

  it("should be able to see a list of all purchases with their time of purchase", (done) => {
    request(app)
      .get("/api/vendor/purchases")
      .expect(200)
      .expect('Content-Type','application/json; charset=utf-8')
      .expect( (res) => {
        assert(res);
        assert(res.body);
        assert(res.body.purchases);
        res.body.purchases.forEach( (purchase) => {
          assert(purchase);
          assert(purchase.item !== "");
          assert(purchase.date);
          assert(purchase.cost >= 0);
        });
      })
      .end(done);
  });

  it("should be able to update the description, quantity, and costs of items in the machine", (done) => {
    assert(false);
    done();
  });

  it("should be able to add a new item to the machine", (done) => {
    assert(false);
    done();
  });

});

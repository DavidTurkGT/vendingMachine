const assert = require('assert');
const mongoose = require('mongoose');
const config = require('../config')[process.env.NODE_ENV || "test"];
const app = require('../app');

before("Setting up...", (done) => {
  done();
});

after("Cleaning up...", (done) => {
  done();
});

describe("A vendor", () => {

  it("should be able to see total amount of money in machine", (done) => {
    assert(false);
    done();
  });

  it("should be able to see a list of all purchases with their time of purchase", (done) => {
    assert(false);
    done();
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

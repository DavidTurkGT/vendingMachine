const assert = require('assert');
const mongoose = require('mongoose');
const config = require('../config')[process.env.NODE_ENV || "test"];
const app = require('../app');

before("Setting up...", (done) =>{
  done();
});

after("Cleaning up...", (done) => {
  done();
});

describe("A customer", () => {

  it("should be able to get a list of the current items, their costs, and quantities of those items", (done) =>{
    assert(false);
    done();
  });

  it("should be able to buy an item using money", (done) => {
    assert(false);
    done()
  });

  it("should be able to buy an item, paying more than the item is worth (imagine putting a dollar in a machine for a 65-cent item) and get correct change. This change is just an amount, not the actual coins.", (done) => {
      assert(false);
      done();
  });

  it("should not be able to buy items that are not in the machine, but instead get an error", (done) => {
    assert(false);
    done();
  });

});

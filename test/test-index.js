var main = require("../");

exports["test main"] = function(assert) {
  assert.pass("Unit test running!");
};

exports["test main async"] = function(assert, done) {
  assert.pass("async Unit test running!");
  done();
};

exports["test checkEnabled"] = function(assert, done) {
  main.checkEnabled(function(result) {
    assert.ok((result === true), "TP enabled");
    done();
  });
};

require("sdk/test").run(exports);

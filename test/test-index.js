var main = require("../");
var prefSvc = require("sdk/preferences/service");

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

exports["test cookie policy"] = function(assert, done) {
  assert.notEqual(prefSvc.get('network.cookie.cookieBehavior', 0), 0);
  done();
};

exports["test tracking protection enabled"] = function(assert, done) {
  assert.equal(prefSvc.get('privacy.trackingprotection.enabled', false), true);
  done();
};

require("sdk/test").run(exports);

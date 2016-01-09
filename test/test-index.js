var main = require("../");
var prefSvc = require("sdk/preferences/service");

function resetPrefs() {
	prefSvc.set('network.cookie.cookieBehavior', 0);
	prefSvc.set('network.cookie.thirdparty.sessionOnly', false);
	prefSvc.set('privacy.trackingprotection.enabled', false);
}

exports["test settings"] = function(assert, done) {
	resetPrefs();
	main.checkEnabled();
	assert.ok(prefSvc.get('network.cookie.cookieBehavior', 0) > 0);
	assert.equal(prefSvc.get('network.cookie.thirdparty.sessionOnly'),
		     true);
	assert.equal(prefSvc.get('privacy.trackingprotection.enabled'),
		     true);
	main.onUnload('disable');
	done();
};

exports["test doUnload"] = function(assert, done) {
	main.checkEnabled();
	main.onUnload('disable');
	assert.ok(prefSvc.get('network.cookie.cookieBehavior') == 0);
	assert.equal(prefSvc.get('network.cookie.thirdparty.sessionOnly'),
		     false);
	assert.equal(prefSvc.get('privacy.trackingprotection.enabled'),
		     false);
	done();
};

exports["test save manual cookie pref"] = function(assert, done) {
	resetPrefs();
	main.checkEnabled();
	prefSvc.set('network.cookie.cookieBehavior', 1);
	main.onUnload('disable');
	assert.equal(prefSvc.get('network.cookie.cookieBehavior'), 1);
	resetPrefs();
	done();
};

exports["test save manual TP pref"] = function(assert, done) {
	resetPrefs();
	main.checkEnabled();
        prefSvc.set('privacy.trackingprotection.enabled', true);
	main.onUnload('disable');
	assert.equal(prefSvc.get('privacy.trackingprotection.enabled'),
		     true);
	resetPrefs();
	done();
};

require("sdk/test").run(exports);

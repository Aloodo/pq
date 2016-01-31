var simpleStorage = require('sdk/simple-storage');
var prefSvc = require("sdk/preferences/service");
var { PrefsTarget } = require("sdk/preferences/event-target");

var tpPref = 'privacy.trackingprotection.enabled';
var sessionPref = 'network.cookie.thirdparty.sessionOnly';

/* Safe values are 1st-party only: 1
 *                 No cookies:     2
 *                 Visited only:   3
 * Unsafe value is accept all:     0
 */
var cookiePref = 'network.cookie.cookieBehavior';

var pt = PrefsTarget();
var stg = simpleStorage.storage;

function doUnload(reason) {
	if (reason != 'disable' && reason != 'uninstall') {
		return;
	}
	if (stg[cookiePref] != undefined &&
	    prefSvc.get(cookiePref, 0) == 3) {
		prefSvc.set(cookiePref, stg[cookiePref]);
	}
	if (stg[sessionPref] != undefined) {
		prefSvc.set(sessionPref, stg[sessionPref]);
	}
	if (stg[tpPref] != undefined) {
		prefSvc.set(tpPref, stg[tpPref]);
	}
	stg = {};
}

function checkEnabled() {
	/* Persist original values for preferences */
	if (stg[cookiePref] === undefined) {
		persistPref(cookiePref);
	}
	if (stg[sessionPref] === undefined) {
		persistPref(sessionPref);
	}
	if (stg[tpPref] === undefined) {
		persistPref(tpPref);
	}

	if (prefSvc.get(tpPref, false) && 
	    prefSvc.get(sessionPref, false) &&	
	    prefSvc.get(cookiePref, 0) > 0) {
		return;
	}
	doConfig();
}

function doConfig() {
	prefSvc.set(tpPref, true);
	prefSvc.set(sessionPref, true);
	/* only change cookie behavior if wide-open */
	if (prefSvc.get(cookiePref, 0) == 0) {
		prefSvc.set(cookiePref, 3);
	}
}

function persistPref(prefName) {
	stg[prefName] = prefSvc.get(prefName);
}

checkEnabled();

/* Persist preference changes by user */
pt.on(cookiePref, persistPref);
pt.on(sessionPref, persistPref);
pt.on(tpPref, persistPref);

exports.checkEnabled = checkEnabled;
exports.onUnload = doUnload;


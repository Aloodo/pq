var { Cc, Ci } = require('chrome');
var simpleStorage = require('sdk/simple-storage');
var utils = require('sdk/window/utils');
var tabs = require("sdk/tabs");
var prefSvc = require("sdk/preferences/service");
var { PrefsTarget } = require("sdk/preferences/event-target");
var window = utils.getMostRecentBrowserWindow();

var tpPref = 'privacy.trackingprotection.enabled';

/* Safe values are 1st-party only: 1
 *                 No cookies:     2
 *                 Visited only:   3
 * Unsafe value is accept all:     0
 */
var cookiePref = 'network.cookie.cookieBehavior';

var pt = PrefsTarget();

var prompts =
  Cc["@mozilla.org/embedcomp/prompt-service;1"].
      getService(Ci.nsIPromptService);

var runTPtest = {value: false};
var stg = simpleStorage.storage;

function doUnload(reason) {
	if (reason != 'disable') {
		return;
	}
	if (stg[cookiePref] != undefined &&
	    prefSvc.get(cookiePref, 0) == 3) {
		prefSvc.set(cookiePref, stg[cookiePref]);
	}
	if (stg[tpPref] != undefined) {
		prefSvc.set(tpPref, stg[tpPref]);
	}
}

function checkEnabled() {
	if (prefSvc.get(tpPref, false) && prefSvc.get(cookiePref, 0) > 0) {
		return;
	}
	doConfig();
}

function doConfig() {
	prefSvc.set(tpPref, true);
	if (prefSvc.get(cookiePref, 0) == 0) {
	/* only change cookie behavior if wide-open */
		prefSvc.set(cookiePref, 3);
	}

	prompts.alertCheck(window, "pq",
	"Firefox Tracking Protection and third-party cookie " +
	"protection are now enabled. " +
	"Thank you for helping to protect the web sites " +
	"you use from data leakage and fraud.",
	"Run tracking test?", runTPtest);
	if (runTPtest.value) {
		tabs.open('http://www.aloodo.org/test/start/');
	}
}

/* Persist original values for preferences */
if (stg[cookiePref] === undefined) {
	stg[cookiePref] = prefSvc.get(cookiePref, 0);
}
if (stg[tpPref] === undefined) {
	stg[tpPref] = prefSvc.get(tpPref, false);
}

checkEnabled();

/* Persist preference changes by user */
pt.on(cookiePref, function(prefName) {
	stg[prefName] = prefSvc.get(prefName);
});
pt.on(tpPref, function(prefName) {
	stg[prefName] = prefSvc.get(prefName);
});

exports.checkEnabled = checkEnabled;
exports.onUnload = doUnload;


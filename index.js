var { Cc, Ci } = require('chrome');
var utils = require('sdk/window/utils');
var tabs = require("sdk/tabs");
var prefSvc = require("sdk/preferences/service");
var window = utils.getMostRecentBrowserWindow();

var tpPref = 'privacy.trackingprotection.enabled';

/* Safe values are 1st-party only: 1
 *                 No cookies:     2
 *                 Visited only:   3
 * Unsafe value is accept all:     0
 */
var cookiePref = 'network.cookie.cookieBehavior';

var prompts =
  Cc["@mozilla.org/embedcomp/prompt-service;1"].
      getService(Ci.nsIPromptService);

var runTPtest = {value: false};

function checkEnabled(cb) {
	var tp = prefSvc.get(tpPref, false);
	var cp = prefSvc.get(cookiePref, 0);
	cb(tp && (cp > 0));
}

function doConfig(alreadyOn) {
	if (alreadyOn) {
		return;
	}
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

checkEnabled(doConfig);

exports.checkEnabled = checkEnabled;

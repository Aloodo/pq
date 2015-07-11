var { Cc, Ci } = require('chrome');
var utils = require('sdk/window/utils');
var tabs = require("sdk/tabs");
var prefSvc = require("sdk/preferences/service");
var window = utils.getMostRecentBrowserWindow();

var tpPref = 'privacy.trackingprotection.enabled';

var prompts =
  Cc["@mozilla.org/embedcomp/prompt-service;1"].
      getService(Ci.nsIPromptService);

var runTPtest = {value: false};

function checkEnabled(cb) {
	var value = prefSvc.get(tpPref, false);
	cb(value);
}

function doConfig(alreadyOn) {
	if (alreadyOn) {
		return;
	}
	prefSvc.set(tpPref, true);

	prompts.alertCheck(window, "pq extension",
	"Firefox Tracking Protection is now enabled. " +
	"Thank you for helping to protect the web sites " +
	"you use from data leakage and fraud.",
	"Run tracking test?", runTPtest);
	if (runTPtest.value) {
		tabs.open('http://www.aloodo.org/test/start/');
	}
}

checkEnabled(doConfig);

exports.checkEnabled = checkEnabled;

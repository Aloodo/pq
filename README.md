#pq: world's simplest tracking protection tool.

This just turns on the Tracking Protection that is already in Firefox, and sets third-party cookie policy to a sane value.

Easier than going to about:config? Probably for some.


## Install on Firefox

Install [pq from the Add-ons for Firefox site](https://addons.mozilla.org/en-US/firefox/addon/pq/).


## Development

Run tests:

	jpm -b /usr/lib64/firefox/firefox --binary-args about:blank test

Run a new Firefox with the current code:

	jpm -b /usr/lib64/firefox/firefox run

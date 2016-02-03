#pq: world's simplest tracking protection tool.

This Firefox add-on turns on the Tracking Protection already built in to the browser, and sets third-party cookie policy to a sane value.

[Install pq from the Add-ons for Firefox site](https://addons.mozilla.org/en-US/firefox/addon/pq/).

## Resources

[Test your browser.](http://www.aloodo.org/test/start/) Are you protected from third-party tracking?

For Google Chrome: [Palmerized Chrome](https://chrome.google.com/webstore/detail/palmerized-chrome/ecmhflkoahhjjpddfopclbhiogelneoc)

## Development

Run tests:

	jpm -b /usr/lib64/firefox/firefox --binary-args about:blank test

Run a new Firefox with the current code:

	jpm -b /usr/lib64/firefox/firefox run



const { PluginLoader } = require('..')
const { join } = require('path')

//var purl = 'http://localhost:8888/twitchcord/tests/'
var purl = join(__dirname, 'sample-plugin')

async function plugin_test() {
	var plugin = new PluginLoader(purl)
	await plugin.load()
	plugin.sandbox.run()
	console.log("Awaiting asynctest")
	await plugin.sandbox.asynctest();
	console.log("Completed asynctest")

	plugin.sandbox.callbacktest((msg) => {
		console.log("Got message from plugin:", msg)
		const fs1 = require('fs')
		console.log("In main, contents of /etc/passwd", fs1.readFileSync('/etc/passwd'))
	})
}

plugin_test()

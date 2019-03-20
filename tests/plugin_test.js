var PluginLoader = require('../main.js')

var purl = 'http://localhost:8888/twitchcord/tests/'

var plugin = new PluginLoader(purl)
plugin.load().then(values => {
	plugin.run()
}).catch(error => {
	console.log("ERROR", error)
})


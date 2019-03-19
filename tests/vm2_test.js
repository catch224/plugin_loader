const vm2 = require('./external/vm2')
const fs = require('fs')
const path = require('path')
const fetcher = require('./fetcher.js')

var options = {
    console: 'inherit',
	fetcher: fetcher,
    require: {
		context: 'sandbox',
		external: true,
		//import: ['gmodule'],
		mock: {
			//gmodule: api,
			fs: {
				readFileSync: (path) => {
					return "Nice try!"
				}
			}
		},
		root: './plugins'
    }
}

let plugin_vm =  new vm2.NodeVM(options)

if (1) {
	console.log("Testing filesystem plugin");
	let startFile = 'plugins/file1.js'
	let startData = "require('./file1.js').run()";
	let sandboxModule = plugin_vm.run(startData,startFile )
}

if (1) {
	console.log("Testing HTTP plugin");
	let startFile = 'http://localhost:8888/twitchcord/tests/test.js'
	options.require.root = 'http://localhost:8888/twitchcord/tests/'
	let startData = "require('./test.js').run()";
	let sandboxModule = plugin_vm.run(startData,startFile )
}



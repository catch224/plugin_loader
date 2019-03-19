const vm2 = require('vm2')
const fs = require('fs')
const path = require('path')
const fetcher = require('./fetcher')

module.exports = {
    load: function(urlpath, options) {
		// Default options
		var vmoptions = {
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
				root: urlpath
			}
		};

		if (options) {
			Object.assign(vmoptions, options);
		}
		
		let plugin_vm =  new vm2.NodeVM(options)
		
		let startFile = 'http://localhost:8888/twitchcord/tests/test.js'
		options.require.root = 'http://localhost:8888/twitchcord/tests/'
		let startData = "require('./test.js').run()";
		let sandboxModule = plugin_vm.run(startData,startFile )

    }
}

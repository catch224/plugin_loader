const vm2 = require('vm2')
const fs = require('fs')
const path = require('path')
const fetcher = require('./fetcher')

class PluginLoader {
	constructor(plugin_path, options) {
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
				root: plugin_path
			}
		};

		if (options) {
			Object.assign(vmoptions, options);
		}
		
		this.vm =  new vm2.NodeVM(options)
		this.plugin_path = plugin_path
	}

	run() {
		let startData = "require('./test.js').run()";
		let sandboxModule = plugin_vm.run(startData,startFile )
	}
}

module.exports = {
    load: function(urlpath, options) {

    }
}

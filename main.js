const vm2 = require('./external/vm2')
const fs = require('fs')
const path = require('path')
const Fetcher = require('./lib/fetcher')
const PluginAPI = require('./lib/plugin.js')

class PluginLoader {
	constructor(plugin_path, options) {
		this.fetcher = new Fetcher()
		this.plugin_api = new PluginAPI(plugin_path, this.fetcher)

		// Default options
		var vmoptions = {
			console: 'inherit',
			fetcher: this.fetcher,
			require: {
				context: 'sandbox',
				external: true,
				//import: ['gmodule'],
				mock: {
					//gmodule: api,
					plugin: this.plugin_api,
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
		
		this.vm =  new vm2.NodeVM(vmoptions)
		this.plugin_path = plugin_path
	}

	_loadplugin() {
		let fetcher = this.fetcher
		let plugin_path = this.plugin_path
		let manifest_url = fetcher.join(plugin_path, 'package.json')
		//console.log(this.plugin_path, manifest_url)

		return fetcher.cacheResource(manifest_url).then((resp) => {
			var promises = []
			var files2load = []

			var pconfig = JSON.parse(resp.data)
			this.pkg_config = pconfig
			
			files2load.push(pconfig.main)
			for (let file of pconfig.cache) {
				files2load.push(file)
			}

			for (let file of files2load) {
				let p = fetcher.cacheResource(fetcher.join(plugin_path, file))
				promises.push(p)
			}
			return Promise.all(promises)
		}).catch(err => {
			throw(err)
		})
	}
	
	load() {
		return this._loadplugin().then(() => {
			this.sandbox = this.vm.run(`module.exports = require('${this.pkg_config.main}')`, this.fetcher.join(this.plugin_path, 'package.json') )
		})
	}

	run() {
		this.sandbox.run()
		return this.sandbox
	}
}

module.exports = PluginLoader


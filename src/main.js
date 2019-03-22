const vm2 = require('vm2')
const fs = require('fs')
const path = require('path')
const lodash = require('lodash')
const {Fetcher} = require('./fetcher')
const {PluginAPI} = require('./plugin')

class PluginLoader {
	constructor(plugin_path, options) {
		this.fetcher = new Fetcher()
		this.plugin_api = new PluginAPI(plugin_path, this.fetcher)

		// Default options
		var vmoptions = lodash.merge(
		{ // defaults
			console: 'inherit',
			require: {
				context: 'sandbox',
				external: true,
				mock: {
					lodash,
				},
			}
		}, 
		
		options, // Plugin overrides
		
		{ // Mandatory
			fetcher: this.fetcher,
			require: {
				mock: {
					plugin: this.plugin_api,
				},
				root: plugin_path
			}
		})

		if (options) {
			console.log(vmoptions)
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


import { Fetcher } from './fetcher'
import { PluginAPI } from './plugin'
import { NodeVM, NodeVMOptions } from 'vm2'

export class PluginLoader {
	vm: NodeVM
	fetcher = new Fetcher()
	plugin_api: PluginAPI
	pkg_config: { [key: string]: any }
	exports: NodeJS.Module["exports"]
	constructor(public plugin_path: string, options: NodeVMOptions = {}) {
		this.plugin_api = new PluginAPI(plugin_path, this.fetcher)

		this.vm =  new NodeVM(Object.assign({
			// Default options
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
		}, options))
	}

	_loadplugin() {
		let fetcher = this.fetcher
		let plugin_path = this.plugin_path
		let manifest_url = fetcher.join(plugin_path, 'package.json')
		//console.log(this.plugin_path, manifest_url)

		return fetcher.cacheResource(manifest_url).then((resp: { data: string }) => {
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
			this.exports = this.vm.run(`module.exports = require('${this.pkg_config.main}')`, this.fetcher.join(this.plugin_path, 'package.json') )
		})
	}

	run() {
		this.exports.run()
		return this.exports
	}
}



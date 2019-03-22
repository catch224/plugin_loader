const assert=require('assert')
const PluginLoader = require('..')
const lodash = require('lodash')
var plugin_url = './tests/sample-plugin/'


describe('Plugin Basics', () => {
	let plugin
	const SOME_STRING = "Mock fs return value"
	it('loading plugin', async () => {
		plugin = new PluginLoader(plugin_url, {
			require: {
				mock: {
					fs: {
						readFileSync: (path) => {
							return SOME_STRING
						}
					}
				}
			}
		})
		await plugin.load()
		plugin.sandbox.run()
	})

	it('async functions', async () => {
		await plugin.sandbox.asynctest();
	})

	it('callback functions', (done) => {
		plugin.sandbox.callbacktest((msg) => {
			assert.equal(SOME_STRING, msg)
			done()
		})
	})

	it('setTimeout', (done) => {
		plugin.sandbox.setTimeoutTest((msg) => {
			assert.equal(SOME_STRING, msg)
			done()
		})
	})
})
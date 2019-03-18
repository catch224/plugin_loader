const vm2 = require('vm2')
const fs = require('fs')
const path = require('path')
const api = require('./api')

function gfunc1() {
    console.log("FUNC1")
}

var gvar1 = 1001

var sandbox = {
    gfunc1: gfunc1,
    gvar1: gvar1,
}

var options = {
    sandbox: sandbox,
    console: 'inherit',
    require: {
	external: true,
	//import: ['gmodule'],
	builtin: ['path'],
	mock: {
	    gmodule: api,
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

//let sandboxModule = plugin_vm.run(fs.readFileSync('plugins/plugin-main.js'),path.join( __dirname, 'plugins/plugin-main.js') )

let startFile = 'plugins/file1.js'
let sandboxModule = plugin_vm.run(fs.readFileSync(startFile),path.join( __dirname, startFile) )

console.log("Sandbox created")
sandboxModule.run()
console.log("Sandbox finished")


/*
let fnInSandbox = plugin_vm.run("module.exports = function() {return require('./plugins/plugin-main.js')}", path.join( __dirname, 'plugins/plugin-main.js') )
let sandboxModule = fnInSandbox()
console.log("Sandbox created")
sandboxModule.load()
console.log("Sandbox finished")
*/

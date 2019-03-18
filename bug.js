const vm2 = require('vm2')
const fs = require('fs')
const path = require('path')

var options = {
    console: 'inherit',
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

let startFile = 'plugins/file1.js'
let sandboxModule = plugin_vm.run(fs.readFileSync(startFile),path.join( __dirname, startFile) )

sandboxModule.run()



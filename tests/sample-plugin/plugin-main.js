var gmod = require('gmodule')
var myfunc = require('./myfunc')
module.exports = {
    load: function() {
	var fs = require('fs')
	gfunc1()
	console.log(gvar1)
	console.log("Calling myfunc")
	myfunc.somefunc()
    }
}

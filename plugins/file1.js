var fs = require('fs')
var file2 = require('./file2')

module.exports = {
    run: function() {
	console.log("File1: contents of /etc/passwd: ", fs.readFileSync('/etc/passwd'))
	file2.run(require)
    }
}

var fs = require('fs')
var file2 = require('./test2.js')

module.exports = {
    run: function() {
		console.log("I came from alien space!")
		console.log("Test1: contents of /etc/passwd: ", fs.readFileSync('/etc/passwd'))
		file2.run(require)
    }
}

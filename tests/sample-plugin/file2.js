var fs = require('fs')

module.exports = {
    run: function() {
	console.log("File2: contents of /etc/passwd: ", fs.readFileSync('/etc/passwd'))
    }
}

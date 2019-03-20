var fs = require('fs')
var file2 = require('./file2')
var plugin = require('plugin')

module.exports = {
    run: function() {
        console.log("File1: contents of /etc/passwd: ", fs.readFileSync('/etc/passwd'))
    },

    callbacktest: function(callback_fn) {
        console.log("Starting timer")
        plugin.setTimeout(3000).then(() => {
            console.log("Timer triggered, checking fs inside callback:")
            var fs2 = require('fs')
            console.log("File1: contents of /etc/passwd: ", fs2.readFileSync('/etc/passwd'))
            file2.run(require)
            callback_fn("This is from plugin")
        })
    },

    asynctest: function() {
        console.log("File1: started async function")
        return plugin.setTimeout(5000)
    }
}

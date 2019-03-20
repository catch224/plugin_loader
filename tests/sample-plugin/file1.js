var fs = require('fs')
var file2 = require('./file2')
var plugin = require('plugin')

try {
    require('../testaccess.js')
} catch(err) {
    console.log("File1: Testaccess safely out of bounds as expected.")
}

module.exports = {
    run: function() {
        console.log("File1: contents of /etc/passwd: ", fs.readFileSync('/etc/passwd'))
    },

    callbacktest: function(callback_fn) {
        console.log("Starting callback test with timer")
        plugin.setTimeout(3000).then(() => {
            console.log("Timer triggered, checking fs inside callback:")
            var fs2 = require('fs')
            console.log("File1: contents of /etc/passwd: ", fs2.readFileSync('/etc/passwd'))
            file2.run(require)
            callback_fn("This is from plugin")

            try {
                require('../testaccess.js')
            } catch(err) {
                console.log("File1: Testaccess safely out of bounds as expected. (from callback)")
            }
        })
    },

    asynctest: async function() {
        console.log("File1: started async function")

        try {
            require('../testaccess.js')
        } catch(err) {
            console.log("File1: Testaccess safely out of bounds as expected. (from asynctest)")
        }        
        
        await plugin.setTimeout(5000)
    }
}

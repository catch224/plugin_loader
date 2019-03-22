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
        plugin.setTimeout(300).then(() => {
            console.log("Timer triggered, checking fs inside callback:")
            const fs2 = require('fs')
            //console.log("File1: contents of /etc/passwd: ", fs2.readFileSync('/etc/passwd'))
            let contents = fs2.readFileSync('/etc/passwd')
            file2.run()

            try {
                require('../testaccess.js')
            } catch(err) {
                console.log("File1: Testaccess safely out of bounds as expected. (from callback)")
            }

            callback_fn(contents)
        })
    },

    asynctest: async function() {
        const fs3 = require('fs')
        let contents = fs3.readFileSync('/etc/passwd')

        console.log("File1: started async function")

        try {
            require('../testaccess.js')
        } catch(err) {
            console.log("File1: Testaccess safely out of bounds as expected. (from asynctest)")
        }        
        
        await plugin.setTimeout(500)
        return contents
    },

    setTimeoutTest: function(callback) {
        setTimeout(() => {
            const fs4 = require('fs')
            let contents = fs4.readFileSync('/etc/passwd')
            
            console.log("File1.setTimeoutTest: triggered")
            callback(contents)
        }, 1000)
    }
}

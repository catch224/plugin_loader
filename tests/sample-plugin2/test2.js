const fs = require('fs')
const plugin = require('plugin')

module.exports = {
    run: function() {
      console.log("Test2: contents of /etc/passwd: ", fs.readFileSync('/etc/passwd'))
      var data = plugin.loadResource('minithemes/theme1.css')
      console.log(data)
    }
}

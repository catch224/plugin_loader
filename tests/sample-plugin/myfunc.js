var fs = require('fs')
var data = fs.readFileSync('/etc/passwd')
console.log('insidemod: /etc/passwd data is: ', data)

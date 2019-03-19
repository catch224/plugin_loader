const fs = require('fs')
const pa = require('path')
const url = require('url')

//const fetch = require("node-fetch");
const request = require('sync-request')
const gFLDebug = false

const getUrlData = url => {
	try {
		const response = request('GET', url);
		return response.getBody()
	} catch (error) {
		console.log(error);
		return null
	}
};

class MyStat {
	constructor(path) {
		this.path = path
	}

	isDirectory() {
		return this.path[this.path.length-1] === '/'
	}
}

	
module.exports = {
	// From module 'fs'
	readFileSync: (path,options) => {
		var uinfo = url.parse(path)
		if (uinfo.protocol === null) {
			return fs.readFileSync(path, options)
		} else {
			return getUrlData(path)
		}
	},
	existsSync:   (path) => {
		if (gFLDebug) {
			console.log("ExistsSync:", path)
		}
		var uinfo = url.parse(path)
		if (uinfo.protocol === null) {
			return fs.existsSync(path)
		}
		return true
	},
	statSync:     (path) => {
		if (gFLDebug) {
			console.log("StatSync:", path)
		}
		var uinfo = url.parse(path)
		if (uinfo.protocol === null) {
			return fs.statSync(path)
		}
		return new MyStat(path)
	},

	// From module 'path'
	resolve: (path) => {
		if (gFLDebug) {
			console.log("Resolve:", path)
		}
		var uinfo = url.parse(path)
		if (uinfo.protocol === null) {
			return pa.resolve(path)
		}
		uinfo.pathname = pa.resolve(uinfo.path)
		var ret = url.format(uinfo)
		return ret
	},

	dirname: (path) => {
		if (gFLDebug) {
			console.log("Dirname:", path)
		}
		var uinfo = url.parse(path)
		if (uinfo.protocol === null) {
			return pa.dirname(path)
		}
		return url.resolve(path, '.')
	},

	extname: (path) => pa.extname(path)
	
}


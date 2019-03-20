const fs = require('fs')
const pa = require('path')
const url = require('url')

//const fetch = require("node-fetch");
const sync_request = require('sync-request')
const request = require('request')
//const axios   = require('axios')

const gFLDebug = true

const getUrlData = url => {
	try {
		const response = sync_request('GET', url);
		return response.getBody()
	} catch (error) {
		console.log(error);
		return null
	}
};

function isdir(path) {
	return path[path.length-1] === '/'
}

function dirfix(path1, path2) {
	if (isdir(path1) && !isdir(path2)) {
		return path2 + '/'
	}
	return path2
}

function normalizeUrl(urlpath) {
	var uinfo = url.parse(urlpath)
	uinfo.pathname = dirfix(urlpath, pa.resolve(uinfo.pathname))
	return url.format(uinfo)
}

class MyStat {
	constructor(path) {
		this.path = path
	}

	isDirectory() {
		return isdir(this.path)
	}
}

class Fetcher {
	constructor() {
		this.cache = {}
	}

	cacheResource(urlpath) {
		var cache = this.cache
		let uinfo = url.parse(urlpath)
		console.log(urlpath, uinfo)
		if (uinfo.protocol === null) {
			// Load from filesystem
			return new Promise(function(resolve, reject) {
				fs.readFile(urlpath, (err, data) => {
					if (err) {
						reject(err);
					} else {
						cache[urlpath] = data
						resolve({url:urlpath, data:data});
					}
				})
			})
		} else {
			// Load from network
			var options = {
				url: urlpath,
				headers: {
					'User-Agent': 'Node Plugin Loader'
				}
			};
			return new Promise(function(resolve, reject) {
				// Do async job
				request.get(options, function(err, resp, body) {
					if (err) {
						reject(err);
					} else {
						cache[urlpath] = body
						resolve({url:urlpath, data:body});
					}
				})
			})
		}
	}
	
	readFileSync(path,options) {
		if (this.cache[path]) {
			if (gFLDebug) {
				console.log("Fetcher reading from cache: ", path)
			}
			return this.cache[path]
		}
		
		path = normalizeUrl(path)
		console.log('ReadFileSync', path)
		var uinfo = url.parse(path)
		if (uinfo.protocol === null) {
			return fs.readFileSync(path, options)
		} else {
			var data = getUrlData(path)
			this.cache[path] = data
			return data
		}
	}
	
	existsSync(path) {
		var uinfo = url.parse(path)
		if (uinfo.protocol === null) {
			return fs.existsSync(path)
		}

		path = normalizeUrl(path)
		if (gFLDebug) {
			console.log("ExistsSync:", path)
		}
		return true
		//return this.cache[path]
	}
	
	statSync(path) {
		var uinfo = url.parse(path)
		if (uinfo.protocol === null) {
			return fs.statSync(path)
		}

		path = normalizeUrl(path)
		if (gFLDebug) {
			console.log("StatSync:", path)
		}
		return new MyStat(path)
	}

	// From module 'path'
	resolve(path) {
		var uinfo = url.parse(path)
		if (uinfo.protocol === null) {
			return pa.resolve(path)
		}
		uinfo.pathname = pa.resolve(uinfo.pathname)
		var ret = dirfix(path, url.format(uinfo))
		console.log(ret)
		
		if (gFLDebug) {
			console.log("Resolve:", path, '->', ret)
		}
		return ret
	}

	dirname(path) {
		var uinfo = url.parse(path)
		if (uinfo.protocol === null) {
			return pa.dirname(path)
		}

		path = normalizeUrl(path)
		if (gFLDebug) {
			console.log("Dirname:", path)
		}
		return dirfix('/', url.resolve(path, '.'))
	}

	extname(path){
		return pa.extname(path)
	}

	join(path, node) {
		var uinfo = url.parse(path)
		if (uinfo.protocol === null) {
			return pa.join(path, node)
		}

		uinfo.pathname = pa.join(uinfo.pathname, node)
		return url.format(uinfo)
	}
	
	get sep() {
		return pa.sep
	}
}

module.exports = Fetcher

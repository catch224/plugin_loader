import { readFileSync, readFile, existsSync, statSync } from "fs";
import { resolve, dirname, extname, join, sep } from "path";
import sync_request from "sync-request";
import request from "request";
import url from "url";

const gFLDebug = false;

const getUrlData = url => {
  try {
    const response = sync_request("GET", url);
    return response.getBody();
  } catch (error) {
    console.log(error);
    return null;
  }
};

function isdir(path: string) {
  return path[path.length - 1] === "/";
}

function dirfix(path1, path2) {
  if (isdir(path1) && !isdir(path2)) {
    return path2 + "/";
  }
  return path2;
}

function normalizeUrl(urlpath) {
  var uinfo = url.parse(urlpath);
  uinfo.pathname = dirfix(urlpath, resolve(uinfo.pathname));
  return url.format(uinfo);
}

class MyStat {
  constructor(public path: string) {}

  isDirectory() {
    return isdir(this.path);
  }
}

export class Fetcher {
  cache = {};
  cacheResource(urlpath: string) {
    var cache = this.cache;
    let uinfo = url.parse(urlpath);
    if (uinfo.protocol === null) {
      // Load from filesystem
      return new Promise(function(resolve, reject) {
        readFile(urlpath, (err, data) => {
          if (err) {
            reject(err);
          } else {
            cache[urlpath] = data;
            resolve({ url: urlpath, data: data });
          }
        });
      });
    } else {
      // Load from network
      var options = {
        url: urlpath,
        headers: {
          "User-Agent": "Node Plugin Loader"
        }
      };
      return new Promise(function(resolve, reject) {
        // Do async job
        request.get(options, function(err, resp, body) {
          if (err) {
            reject(err);
          } else {
            cache[urlpath] = body;
            resolve({ url: urlpath, data: body });
          }
        });
      });
    }
  }

  readFileSync(
    path: string,
    options?: typeof readFileSync extends (path, options: infer U) => any
      ? U
      : never
  ) {
    if (this.cache[path]) {
      if (gFLDebug) {
        console.log("Fetcher reading from cache: ", path);
      }
      return this.cache[path];
    }

    path = normalizeUrl(path);
    if (gFLDebug) {
      console.log("ReadFileSync", path);
    }
    var uinfo = url.parse(path);
    if (uinfo.protocol === null) {
      return readFileSync(path, options);
    } else {
      var data = getUrlData(path);
      this.cache[path] = data;
      return data;
    }
  }

  existsSync(path) {
    var uinfo = url.parse(path);
    if (uinfo.protocol === null) {
      return existsSync(path);
    }

    path = normalizeUrl(path);
    if (gFLDebug) {
      console.log("ExistsSync:", path);
    }
    return true;
    //return this.cache[path]
  }

  statSync(path) {
    var uinfo = url.parse(path);
    if (uinfo.protocol === null) {
      return statSync(path);
    }

    path = normalizeUrl(path);
    if (gFLDebug) {
      console.log("StatSync:", path);
    }
    return new MyStat(path);
  }

  // From module 'path'
  resolve(path) {
    var uinfo = url.parse(path);
    if (uinfo.protocol === null) {
      return resolve(path);
    }
    uinfo.pathname = resolve(uinfo.pathname);
    var ret = dirfix(path, url.format(uinfo));

    if (gFLDebug) {
      console.log("Resolve:", path, "->", ret);
    }
    return ret;
  }

  dirname(path) {
    var uinfo = url.parse(path);
    if (uinfo.protocol === null) {
      return dirname(path);
    }

    path = normalizeUrl(path);
    if (gFLDebug) {
      console.log("Dirname:", path);
    }
    return dirfix("/", url.resolve(path, "."));
  }

  extname(path) {
    return extname(path);
  }

  join(path, node) {
    var uinfo = url.parse(path);
    if (uinfo.protocol === null) {
      return join(path, node);
    }

    uinfo.pathname = join(uinfo.pathname, node);
    return url.format(uinfo);
  }

  get sep() {
    return sep;
  }
}

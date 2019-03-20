class PluginAPI {
    constructor(plugin_root, fetcher) {
        this.fetcher = fetcher
        this.plugin_root = plugin_root
    }

    loadResource(respath) {
        return this.fetcher.readFileSync(this.fetcher.join(this.plugin_root, respath))
    }

    setTimeout(msec) {
        return new Promise( (resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, msec)
        })
    }
} 

module.exports = PluginAPI

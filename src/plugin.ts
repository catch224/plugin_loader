import { Fetcher } from './fetcher'

// This seems to expose the fetcher directly to plugins? Idk if thats on purpose
export class PluginAPI {
    constructor(public plugin_root: string, public fetcher: Fetcher) {}

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


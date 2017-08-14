import { JumpFm } from './JumpFm'
import {
    pluginsPackage,
    pluginsFullPath,
    packageJson
} from './files';

import * as path from 'path'

export class PluginManager {
    readonly jumpFm: JumpFm

    constructor(jumpFm) {
        this.jumpFm = jumpFm
    }

    private loadCss = (href) => {
        if (!href) return
        console.log(href)
        const link = document.createElement('link')
        link.setAttribute('rel', 'stylesheet')
        link.setAttribute('href', href)
        document.head.appendChild(link)
    }


    loadPlugins = () => {
        if (!pluginsPackage.dependencies) return
        const pkgs = Object.keys(pluginsPackage.dependencies)
        pkgs.forEach(name => {
            try {
                const s = Date.now()

                const pluginDir = path.join(pluginsFullPath, 'node_modules', name)
                const plugin = require(pluginDir)

                if (plugin.css)
                    plugin.css.forEach(css =>
                        this.loadCss(path.join(pluginDir, css))
                    )

                plugin.load(this.jumpFm)

                console.log(`${name} in ${Date.now() - s} milliseconds`)
            } catch (e) {
                console.log(e)
            }
        })
        // npm.install(pkgs, {
        //     cwd: pluginsFullPath,
        //     save: false,
        // })
        //     .then(() => {
        //         console.log('done installing')
        //     })
        //     .catch(() => {
        //         console.log('err')
        //     })
    }
}
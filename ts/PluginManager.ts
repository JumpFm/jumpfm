import { JumpFm } from 'jumpfm-api'

import {
    pluginsPath,
    pluginsPackageJson,
    packageJson,
    savePlugins
} from './files';

import * as fs from 'fs-extra'
import * as npm from 'npm'
import * as path from 'path'
import * as installIfNeeded from 'install-if-needed'

const defaultPlugins = {
    dependencies: {
        'jumpfm-clock': '^1.0.0'
        , 'jumpfm-weather': '^1.0.0'
        , 'jumpfm-fs': '^1.0.0'
        , 'jumpfm-key-nav': '^1.0.0'
        , 'jumpfm-flat-mode': '^1.0.0'
        , 'jumpfm-file-ops': '^1.0.0'
        , 'jumpfm-version': '^1.0.0'
        , 'jumpfm-copy': '^1.0.0'
        , 'jumpfm-gist': '^1.0.0'
        , 'jumpfm-git-status': '^1.0.0'
        , 'jumpfm-history': '^1.0.0'
        , 'jumpfm-zip': '^1.0.0'
        , 'jumpfm-jump': '^1.0.0'
    }
}

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

    private getPackage = () => {
        try {
            return require(pluginsPackageJson)
        } catch (e) {
            console.log('creating')
            fs.writeFileSync(
                pluginsPackageJson
                , JSON.stringify(defaultPlugins, null, 4)
            )
            return defaultPlugins
        }
    }

    private loadPlugin = (name: string) => {
        try {
            const pluginDir = path.join(pluginsPath, 'node_modules', name)
            const plugin = require(pluginDir)

            if (plugin.css)
                plugin.css.forEach(css =>
                    this.loadCss(path.join(pluginDir, css))
                )

            plugin.load(this.jumpFm)
        } catch (e) {
            console.log(e)
        }
    }

    loadPlugins = (done: (err?) => void) => {
        const pkg = this.getPackage()
        process.chdir(pluginsPath)
        npm.load({
            save: true
        }, (err, res) => {
            if (err) return done(err)
            npm.commands.update([], (err, res) => {
                if (err) return done(err)
                try {
                    Object.keys(pkg.dependencies).forEach(name => {
                        const s = Date.now()
                        this.loadPlugin(name)
                        console.log(`${name} in ${Date.now() - s} milliseconds`)
                    })
                    done()
                } catch (e) {
                    done(e)
                }
            })
        })
    }
}
import { JumpFm } from 'jumpfm-api'

import {
    pluginsRoot,
    pluginsPath,
    packageJson,
    savePlugins
} from './files';

import * as path from 'path'
import * as installIfNeeded from 'install-if-needed'

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

    createBlankPackageIfNeeded = () => {
        try {
            require(pluginsPath)
        } catch (e) {
            savePlugins({
                name: 'plugins',
                version: '1.0.0',
                'dependencies': {}
            })
        }
    }

    loadPlugin = (name: string) => {
        try {
            const s = Date.now()

            const pluginDir = path.join(pluginsRoot, 'node_modules', name)
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
    }

    loadAll = () => {
        Object.keys(require(pluginsPath).dependencies).forEach(name => {
            this.loadPlugin(name)
        })
    }

    loadPlugins = (done: (e) => void) => {
        this.createBlankPackageIfNeeded()
        installIfNeeded({
            cwd: pluginsRoot,
            dependencies: [
                'jumpfm-clock'
                , 'jumpfm-copy'
                , 'jumpfm-fs'
                , 'jumpfm-gist'
                , 'jumpfm-git-status'
                , 'jumpfm-history'
                , 'jumpfm-jump'
                , 'jumpfm-version'
                , 'jumpfm-weather'
                , 'jumpfm-zip'
                , 'jumpfm-file-ops'
                , 'jumpfm-key-nav'
                , 'jumpfm-flat-mode'
            ]
        }, e => {
            this.loadAll()
            done(e)
        })
    }
}
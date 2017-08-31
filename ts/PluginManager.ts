import { JumpFm } from 'jumpfm-api'

import {
    pluginsPath,
    pluginsPackageJson,
    packageJson,
    savePlugins
} from './files';

import * as check from 'check-dependencies'
import * as fs from 'fs-extra'
import * as npm from 'npm'
import * as path from 'path'
import * as watch from 'node-watch'

interface checkRes {
    status: number,         // 0 if successful, 1 otherwise 
    depsWereOk: boolean,    // true if dependencies were already satisfied 
    log: string[],          // array of logged messages 
    error: string[],        // array of logged errors 
}

const defaultPlugins = {
    dependencies: {
        "jumpfm-font-size": ">=1.0.0",
        "jumpfm-clock": ">=1.0.0",
        "jumpfm-copy": ">=1.0.0",
        "jumpfm-file-ops": ">=1.0.0",
        "jumpfm-filter": ">=1.0.0",
        "jumpfm-flat-mode": ">=1.0.0",
        "jumpfm-fs": ">=1.0.0",
        "jumpfm-gist": ">=1.0.0",
        "jumpfm-git-status": ">=1.0.0",
        "jumpfm-history": ">=1.0.0",
        "jumpfm-icons": ">=1.0.0",
        "jumpfm-jump": ">=1.0.0",
        "jumpfm-key-nav": ">=1.0.0",
        "jumpfm-version": ">=1.0.0",
        "jumpfm-weather": ">=1.0.0",
        "jumpfm-zip": ">=1.0.0"
    }
}

class PluginsLoader {
    jumpFm: JumpFm;
    done: (err?: any) => void;
    private loaded = {}

    constructor(jumpFm: JumpFm, done: (err?) => void) {
        this.jumpFm = jumpFm
        this.done = () => {
            jumpFm.statusBar.msg('plugins').setText('')
            done()
        }
    }

    private loadCss = (href) => {
        if (!href) return
        const link = document.createElement('link')
        link.setAttribute('rel', 'stylesheet')
        link.setAttribute('href', href)
        document.head.appendChild(link)
    }

    private loadPlugin = (name: string) => {
        try {
            console.time(name)

            if (this.loaded[name]) return
            this.loaded[name] = true

            const pluginDir = path.join(pluginsPath, 'node_modules', name)
            const plugin = require(pluginDir)

            if (plugin.css)
                plugin.css.forEach(css =>
                    this.loadCss(path.join(pluginDir, css))
                )

            plugin.load(this.jumpFm)

            console.timeEnd(name)
        } catch (e) {
            console.log(e)
        }
    }

    private getPackage = () => {
        try {
            return fs.readJsonSync(pluginsPackageJson)
        } catch (e) {
            fs.writeFileSync(
                pluginsPackageJson
                , JSON.stringify(defaultPlugins, null, 4)
            )
            return defaultPlugins
        }
    }

    loadPlugins(pkg) {
        try {
            Object.keys(pkg.dependencies).forEach(name => {
                this.loadPlugin(name)
            })
            this.done()
        } catch (e) {
            console.log(e)
            this.done(e)
        }
    }

    load() {
        const pkg = this.getPackage()
        const checkRes: checkRes = check.sync({
            packageDir: pluginsPath
        })
        if (checkRes.depsWereOk) {
            this.loadPlugins(pkg)
        }
        process.chdir(pluginsPath)
        npm.load({
            save: true
        }, (err, res) => {
            if (err) return this.done(err)
            npm.commands.update([], (err, res) => {
                if (err) return this.done(err)
                if (!checkRes.depsWereOk) this.loadPlugins(pkg)
            })
        })
    }
}

export class PluginManager {
    readonly jumpFm: JumpFm

    constructor(jumpFm) {
        this.jumpFm = jumpFm
    }

    loadAndUpdatePlugins = (done: (err?) => void) => {
        this.jumpFm.statusBar.msg('plugins')
            .setType('info')
            .setText('Downloading plugins (can take a while)...')
            .setTooltip('This might take some time')

        const pluginLoader = new PluginsLoader(this.jumpFm, done)

        pluginLoader.load()
        watch(pluginsPackageJson, () => {
            pluginLoader.load()
        })
    }
}
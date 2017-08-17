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
import * as installIfNeeded from 'install-if-needed'

interface checkRes {
    status: number,      // 0 if successful, 1 otherwise 
    depsWereOk: boolean, // true if dependencies were already satisfied 
    log: string[],          // array of logged messages 
    error: string[],        // array of logged errors 
}

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

class PluginsLoader {
    jumpFm: JumpFm;
    deps: string[];
    done: (err?: any) => void;

    constructor(jumpFm: JumpFm, deps: string[], done: (err?) => void) {
        this.jumpFm = jumpFm
        this.deps = deps
        this.done = done
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

    loadPlugins() {
        try {
            this.deps.forEach(name => {
                const s = Date.now()
                this.loadPlugin(name)
                console.log(`${name} in ${Date.now() - s} milliseconds`)
            })
            this.done()
        } catch (e) {
            this.done(e)
        }
    }

    load() {
        const checkRes: checkRes = check.sync({
            packageDir: pluginsPath
        })
        if (checkRes.depsWereOk) {
            this.loadPlugins()
        }
        process.chdir(pluginsPath)
        npm.load({
            save: true
        }, (err, res) => {
            if (err) return this.done(err)
            npm.commands.update([], (err, res) => {
                if (err) return this.done(err)
                if (!checkRes.depsWereOk) this.loadPlugins()
            })
        })
    }
}

export class PluginManager {
    readonly jumpFm: JumpFm

    constructor(jumpFm) {
        this.jumpFm = jumpFm
    }

    private getPackage = () => {
        try {
            return require(pluginsPackageJson)
        } catch (e) {
            fs.writeFileSync(
                pluginsPackageJson
                , JSON.stringify(defaultPlugins, null, 4)
            )
            return defaultPlugins
        }
    }

    loadAndUpdatePlugins = (done: (err?) => void) => {
        this.jumpFm.statusBar.info('plugins', {
            txt: 'Downloading plugins (can take a while)...',
            dataTitle: 'This might take some time'
        })


        new PluginsLoader(
            this.jumpFm
            , Object.keys(this.getPackage().dependencies)
            , done
        ).load()
    }
}
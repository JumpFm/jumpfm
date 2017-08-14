import { JumpFm } from './JumpFm'
import {
    editableFiles,
    keyboard,
    saveKeyboard,
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

    loadPlugins = () => {
        if (!pluginsPackage.dependencies) return
        const pkgs = Object.keys(pluginsPackage.dependencies)
        console.log('installing', pkgs)
        // npm.install(pkgs, {
        //     cwd: pluginsFullPath,
        //     save: false,
        // })
        //     .then(() => {
        //         console.log('done installing')
        //         pkgs.forEach(name => {
        //             try {
        //                 const s = Date.now()
        //                 require(
        //                     path.join(pluginsFullPath, 'node_modules', name)
        //                 ).load(this.jumpFm)
        //                 console.log(`${name} in ${Date.now() - s} milliseconds`)
        //             } catch (e) {
        //                 console.log(e)
        //             }
        //         })
        //     })
        //     .catch(() => {
        //         console.log('err')
        //     })
    }
}
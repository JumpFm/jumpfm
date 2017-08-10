import { Plugin } from './Plugin'
import { JumpFm } from './JumpFm'
import { Panel, Url } from './Panel'
import { Item } from './Item'
import { opn } from './opn'
import { getExtIcon } from './icons'

import * as homedir from 'homedir'
import * as fs from 'fs'
import * as path from 'path'
import * as watch from 'node-watch'

var showHiddenFiles = false

class FileSystem {
    watcher = { close: () => { } }
    readonly panel: Panel

    constructor(panel: Panel) {
        this.panel = panel
        panel.onCd(this.cd)
    }

    cd = (url: Url) => {
        if (url.protocol) {
            this.watcher.close()
            return
        }
        const path = url.path
        if (!fs.existsSync(path)) return
        if (fs.statSync(path).isDirectory()) {
            this.watcher.close()
            this.ll()
            this.watcher = watch(path, { recursive: false }, () =>
                this.ll()
            )
        }
        else opn(path)
    }

    ll = () => {
        const fullPath = this.panel.getPath()
        this.panel.setItems(
            fs.readdirSync(fullPath)
                .filter(name => showHiddenFiles || name.indexOf('.') != 0)
                .map(name => ({
                    name: name,
                    path: path.join(fullPath, name),
                }))
                .filter(file => fs.existsSync(file.path))
                .map(file => {
                    const stat = fs.statSync(file.path)
                    const ext = path.extname(file.path).substr(1).toLowerCase()
                    const icon = getExtIcon(ext) || (
                        stat.isDirectory() ?
                            'file-icons/default_folder.svg' :
                            'file-icons/default_file.svg'
                    )

                    return {
                        icon: icon,
                        path: file.path,
                        name: file.name,
                        size: stat.size,
                        mtime: stat.mtime.getTime(),
                        sel: false
                    }

                })
        )
    }
}

class PluginFileSystem extends Plugin {
    fss: FileSystem[] = []
    onLoad() {
        const panels = this.jumpFm.panels
        this.fss = panels.map(panel => new FileSystem(panel))
        this.jumpFm.bindKeys('toggleHiddenFiles', ['h'], () => {
            showHiddenFiles = !showHiddenFiles
            this.fss.forEach(fs => fs.ll())
            this.msg()
        })
        this.msg()
        panels.forEach(panel => panel.cd(homedir()))
    }

    msg = () => {
        this.jumpFm.statusBar.msg(
            'hidden',
            'hidden',
            showHiddenFiles ? ['info'] : ['info', 'del']
        )
    }
}

module.exports = PluginFileSystem
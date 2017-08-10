import { Plugin } from './Plugin'
import { JumpFm } from './JumpFm'
import { Panel, Url } from './Panel'
import { Item } from './Item'
import { getExtIcon } from './icons'

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
        this.watcher.close()
        if (url.protocol) return
        this.ll()
        this.watcher = watch(url.path, { recursive: false }, this.ll)
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
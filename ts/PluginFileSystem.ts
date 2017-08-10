import { Plugin } from './Plugin'
import { JumpFm } from './JumpFm'
import { Panel, Url } from './Panel'
import { Item, itemFromPath } from './Item'

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
                .map(name => path.join(fullPath, name))
                .filter(fullPath => fs.existsSync(fullPath))
                .map(fullPath => itemFromPath(fullPath))
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
import * as fs from 'fs-extra';
import * as watch from 'node-watch';
import * as path from 'path';

import { itemFromPath } from './Item';
import { Panel } from './Panel';
import { Plugin } from './Plugin';

var showHiddenFiles = false

class FileSystem {
    watcher = { close: () => { } }
    readonly panel: Panel

    constructor(panel: Panel) {
        this.panel = panel
        panel.listen(this)
    }

    onPanelCd = () => {
        const url = this.panel.getUrl()
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
        this.jumpFm.statusBar.msg(showHiddenFiles ? ['info'] : ['info', 'del'])
            ('hidden', '.hidden')
    }
}

module.exports = PluginFileSystem
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

class PluginFileSystem extends Plugin {
    watcher = { close: () => { } }

    onLoad() {
        [0, 1].forEach(i => {
            this.jumpFm.panels.getPanel(i).onCd(this.cd).cd({
                path: homedir()
            })
        })
    }

    cd = (panel: Panel, url: Url) => {
        if (url.protocol) {
            this.watcher.close()
            return
        }
        const path = url.path
        if (!fs.existsSync(path)) return
        if (fs.statSync(path).isDirectory()) {
            this.watcher.close()
            this.ll(panel, path)
            this.watcher = watch(path, { recursive: false }, () =>
                this.ll(panel, path)
            )
        }
        else opn(path)
    }

    ll = (panel: Panel, fullPath: string) => {
        // TODO add watcher
        panel.setItems(
            fs.readdirSync(fullPath)
                .map(name => {
                    return {
                        name: name,
                        path: path.join(fullPath, name),
                    }
                })
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

module.exports = PluginFileSystem
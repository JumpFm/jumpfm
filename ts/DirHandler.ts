import { Plugin } from './Plugin'
import { JumpFm } from './JumpFm'
import { Panel } from './Panel'
import { Item } from './Item'

import * as homedir from 'homedir'
import * as fs from 'fs'
import * as path from 'path'

class DirHandler extends Plugin {
    onLoad() {
        [0, 1].forEach(i => {
            this.jumpFm.panels.getPanel(i).onCd(this.cd).cd(homedir())
        })
    }

    cd = (panel: Panel, url: string, info: any) => {
        // TODO add watcher
        // TODO check if url is dir
        panel.setItems(fs.readdirSync(url).map((name): Item => {
            const fullPath = path.join(url, name)
            // TODO check if file exists
            const stat = fs.statSync(fullPath)
            return {
                icon: 'file-icons/default_file.svg',
                url: fullPath,
                name: name,
                size: stat.size,
                mtime: stat.mtime.getTime()
            }
        }))

        panel.model.title = url
    }
}

module.exports = DirHandler
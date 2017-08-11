import { JumpFm } from './JumpFm'
import { Plugin } from './Plugin'
import { Panel } from './Panel'
import { Item, itemFromPath } from './Item'

import * as watch from 'node-watch'
import * as fs from 'fs'
import * as path from 'path'

const MAX_SIZE = 200

class Flat {
    readonly panel: Panel
    readonly jumpFm: JumpFm
    watcher: { close: () => {} }

    constructor(jumpFm: JumpFm, panel: Panel) {
        this.jumpFm = jumpFm
        this.panel = panel
        panel.listen(this)
    }

    onPanelCd = () => {
        const url = this.panel.getUrl()
        if (url.protocol != 'flat') return
        const items = this.flat(url.path)
        this.panel.setItems(items)
        if (items.length > MAX_SIZE)
            this.jumpFm.statusBar.msg(
                'flat',
                'Flat Mode: too many files to show',
                ['err'],
                2000
            )
    }

    private flat = (dir): Item[] => {
        function flatDir(rootDir: string, res: Item[]) {
            if (res.length > MAX_SIZE) return

            fs.readdirSync(rootDir)
                .map(name => path.join(rootDir, name))
                .filter(fullPath => fs.existsSync(fullPath))
                .forEach(fullPath => {
                    const stat = fs.statSync(fullPath)
                    if (stat.isDirectory()) flatDir(fullPath, res)
                    else res.length <= MAX_SIZE && res.push(itemFromPath(fullPath))
                })
        }

        const res = []
        flatDir(dir, res)
        return res
    }
}

class PluginFlatMode extends Plugin {
    onLoad(): void {
        const jumpFm = this.jumpFm
        jumpFm.panels.forEach(panel => new Flat(jumpFm, panel))
        jumpFm.bindKeys('flatMode', ['r'], () => {
            const pan = jumpFm.getActivePanel()
            const url = pan.getUrl()
            if (url.protocol == 'flat') url.protocol = ''
            else url.protocol = 'flat'
            pan.cd(url)
        })
    }
}

module.exports = PluginFlatMode
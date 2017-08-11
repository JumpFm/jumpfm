import * as fs from 'fs-extra';
import * as path from 'path';

import { Item, itemFromPath } from './Item';
import { JumpFm } from './JumpFm';
import { Panel } from './Panel';
import { Plugin } from './Plugin';


class Flat {
    readonly panel: Panel
    readonly jumpFm: JumpFm
    readonly maxSize
    watcher: { close: () => {} }

    constructor(jumpFm: JumpFm, panel: Panel) {
        this.jumpFm = jumpFm
        this.panel = panel
        this.maxSize = jumpFm.settings.getNum('flatModeMaxSize', 200)
        panel.listen(this)
    }

    onPanelCd = () => {
        const url = this.panel.getUrl()
        if (url.protocol != 'flat') return
        const items = this.flat(url.path)
        this.panel.setItems(items)
        if (items.length > this.maxSize)
            this.jumpFm.statusBar.err(
                'flat',
                'Flat Mode: too many files to show',
                3000
            )
    }

    private flat = (dir): Item[] => {
        const flatDir = (rootDir: string, res: Item[]) => {
            if (res.length > this.maxSize) return

            fs.readdirSync(rootDir)
                .map(name => path.join(rootDir, name))
                .filter(fullPath => fs.existsSync(fullPath))
                .forEach(fullPath => {
                    const stat = fs.statSync(fullPath)
                    if (stat.isDirectory()) flatDir(fullPath, res)
                    else res.length <= this.maxSize && res.push(itemFromPath(fullPath))
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
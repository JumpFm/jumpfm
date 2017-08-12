
import * as fs from 'fs-extra'
import * as fuzzy from 'fuzzy'

import { JumpDb } from './JumpDb';
import { Plugin } from './Plugin';

class PluginJump extends Plugin {
    label = 'Jump'
    jumpDb

    onLoad() {
        const getNum = this.jumpFm.settings.getNum
        this.jumpDb = new JumpDb(
            getNum('jumpMaxDbSize', 300),
            getNum('jumpDbSaveInterval', 1)
        )
        this.jumpFm.panels.forEach(panel => panel.listen(this))
        this.jumpFm.bindKeys('jump', ['j'], () => this.jumpFm.dialog.open(this))
    }

    onPanelCd = (url) => {
        this.jumpDb.visit(url.path)
    }

    onChange = (val: string) => {
        const files = this.jumpDb.db.filter(file => fs.existsSync(file))
        const pattern = val.replace(/\s/, '')
        const options = { pre: '<b>', post: '</b>' }

        return fuzzy
            .filter(pattern, files, options)
            .sort((a, b) => (b.score - a.score) || (a.index - b.index))
            .splice(0, 12)
            .map(res => {
                return {
                    value: res.original as string,
                    html: res.string
                }
            })
    }

    onAccept = (val: string, sug) => {
        this.jumpFm.getActivePanel().cd(sug.value)
    }
}

module.exports = PluginJump

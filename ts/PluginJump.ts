import { Plugin } from './Plugin'
import { JumpFm } from './JumpFm'
import { JumpDb } from './JumpDb'

import * as fs from 'fs'
import * as fuzzy from 'fuzzy'

class PluginJump extends Plugin {
    label = 'PluginJump'
    jumpDb = new JumpDb()

    onLoad() {
        [0, 1].forEach(i => this.jumpFm.panels.getPanel(i).onCd((panel, url) =>
            this.jumpDb.visit(url)
        ))

        this.jumpFm.bindKeys('jump', ['j'], () => this.jumpFm.dialog.open(this))
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
                    value: res.original,
                    html: res.string
                }
            })
    }

    onAccept = (val, sug) => {
        this.jumpFm.panels.getActivePanel().cd(sug)
    }
}

module.exports = PluginJump

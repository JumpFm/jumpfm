import { Plugin } from './Plugin'
import { JumpFm } from './JumpFm'
import { Panel } from './Panel'
import { Item } from './Item'

import * as homedir from 'homedir'
import * as fs from 'fs'
import * as path from 'path'

class PluginKeyNav extends Plugin {
    onLoad() {
        const jumpFm = this.jumpFm
        const bind = jumpFm.keys.bind

        const activePan = () => jumpFm.panels.getActivePanel()
        const step = (d, select = false) => activePan().step(d, select)

        bind('up', ['up'], () => step(-1))
        bind('upSelect', ['shift+up'], () => step(-1, true))
        bind('down', ['down'], () => step(1))
        bind('downSelect', ['shift+down'], () => step(1, true))

        bind('selectAll', ['ctrl+a'], () => activePan().selectAll())
        bind('deselectAll', ['esc'], () => activePan().deselectAll())
    }
}

module.exports = PluginKeyNav
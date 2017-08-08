import { Dialog } from './Dialog'
import { Keys } from './Keys'

import { plugins } from './plugins'
import { Plugin } from './Plugin'

import * as mousetrap from 'mousetrap'

export class JumpFm {
    readonly dialog = new Dialog()
    keys = new Keys()

    constructor() {
        mousetrap.bind('ctrl+=', () => this.model.fontSize++)
        mousetrap.bind('ctrl+-', () => this.model.fontSize--)
        mousetrap.bind('ctrl+0', () => this.model.fontSize = 14)

        setImmediate(() => {
            this.dialog.onLoad()
            this.keys.onLoad()

            plugins().forEach(pluginDesc => {
                const Plug = require(pluginDesc.js)
                const plugin: Plugin = new Plug(this)
                plugin.onLoad()
            })
        })
    }

    model = {
        fontSize: 14,
        dialog: this.dialog.model
    }
}
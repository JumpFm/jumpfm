import { Plugin } from './Plugin'
import { Dialog } from './Dialog'
import { plugins } from './plugins'

import * as mousetrap from 'mousetrap'

export class JumpFm {
    dialog = new Dialog()

    constructor() {
        mousetrap.bind('ctrl+=', () => this.model.fontSize++)
        mousetrap.bind('ctrl+-', () => this.model.fontSize--)
        mousetrap.bind('ctrl+0', () => this.model.fontSize = 14)

        setImmediate(() => {
            this.dialog.onLoad()

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
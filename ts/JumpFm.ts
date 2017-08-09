import { Dialog } from './Dialog'
import { Keys } from './Keys'
import { Panels } from './Panels'

import { plugins } from './plugins'
import { Plugin } from './Plugin'

import * as mousetrap from 'mousetrap'

export class JumpFm {
    readonly dialog = new Dialog()
    readonly keys = new Keys()
    readonly panels = new Panels()

    constructor() {
        mousetrap.bind('ctrl+=', () => this.model.fontSize++)
        mousetrap.bind('ctrl+-', () => this.model.fontSize--)
        mousetrap.bind('ctrl+0', () => this.model.fontSize = 14)

        setImmediate(this.onLoad)
    }

    model = {
        fontSize: 14,
        dialog: this.dialog.model,
        panels: this.panels.model
    }

    onLoad = () => {
        this.dialog.onLoad()
        // this.keys.onLoad()

        plugins().forEach(pluginDesc => {
            const Plug = require(pluginDesc.js)
            const plugin: Plugin = new Plug(this)
            plugin.onLoad()
        })
    }
}
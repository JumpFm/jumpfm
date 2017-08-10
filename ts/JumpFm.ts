import { Dialog } from './Dialog'
import { Panels } from './Panels'
import { PanelView } from './PanelView'

import { plugins } from './plugins'
import { Plugin } from './Plugin'

import * as Mousetrap from 'mousetrap'

export class JumpFm {
    readonly dialog = new Dialog('dialog', 'dialog-input')
    readonly panels = new Panels()

    constructor() {
        setImmediate(() => {
            [0, 1].forEach(i => {
                const view = this.panels.panels[i].view = new PanelView(i)
            })

            this.bindKeys('increaseFontSize', ['ctrl+='], () => this.model.fontSize++)
            this.bindKeys('decreaseFontSize', ['ctrl+-'], () => this.model.fontSize--)
            this.bindKeys('resetFontSize', ['ctrl+0'], () => this.model.fontSize = 14)

            plugins().forEach(pluginDesc => {
                const Plug = require(pluginDesc.js)
                const plugin: Plugin = new Plug(this)
                plugin.onLoad()
            })
        })
    }

    private readonly userKeys = {}

    private getKeys = (actionName: string, defaultKeys: string[]): string[] => {
        const keys = this.userKeys[actionName]
        if (keys && Array.isArray(keys)) return keys
        return defaultKeys
    }

    private bind = (actionName: string,
        defaultKeys: string[],
        action: () => void,
        trap: Mousetrap = Mousetrap) => {
        this.getKeys(actionName, defaultKeys).forEach(key =>
            trap.bind(key, () => {
                action()
                return false
            })
        )
    }

    bindKeysFilterMode = (actionName: string, defaultKeys: string[], action: () => void) =>
        this.panels.panels.forEach(panel =>
            this.bind(actionName, defaultKeys, action, panel.view.filterTrap)
        )

    bindKeys = (actionName: string,
        defaultKeys: string[],
        action: () => void,
        actionFilterMode: () => void = undefined
    ) => {
        this.bind(actionName, defaultKeys, action)

        if (!actionFilterMode) return
        this.bindKeysFilterMode(
            actionName,
            defaultKeys,
            actionFilterMode
        )
    }

    model = {
        fontSize: 14,
        dialog: this.dialog.model,
        panels: this.panels.model
    }
}
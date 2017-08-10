import { Dialog } from './Dialog'
import { Panel } from './Panel'
import { PanelView } from './PanelView'
import { StatusBar } from './StatusBar'

import { plugins } from './plugins'
import { Plugin } from './Plugin'

import * as Mousetrap from 'mousetrap'

export class JumpFm {
    readonly dialog = new Dialog('dialog', 'dialog-input')
    readonly statusBar = new StatusBar()
    readonly panels = [new Panel(), new Panel()]

    switchPanel = () => {
        this.panels.forEach(panel => panel.model.active = !panel.model.active)
    }

    getActivePanel = (): Panel => {
        return this.panels.filter(panel => panel.model.active)[0]
    }

    getPassivePanel = (): Panel => {
        return this.panels.filter(panel => !panel.model.active)[0]
    }

    swapPanels = () => {
        const active = this.getActivePanel()
        const passive = this.getPassivePanel()
        const activePath = active.getPath()
        active.cd(passive.getPath())
        passive.cd(activePath)
        this.switchPanel()
    }

    constructor() {
        setImmediate(() => {
            [0, 1].forEach(i => {
                const view = this.panels[i].view = new PanelView(i)
            })

            this.panels[0].model.active = true

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
        this.panels.forEach(panel =>
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
        panels: this.panels.map(panel => panel.model),
        dialog: this.dialog.model,
        status: this.statusBar.model
    }
}
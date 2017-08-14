import { PluginManager } from './PluginManager'
import { Dialog } from './Dialog'
import {
    editableFiles,
    keyboard,
    saveKeyboard,
    pluginsPackage,
    pluginsFullPath,
    packageJson
} from './files'
import { Panel } from './Panel'
import { PanelView } from './PanelView'
import { Plugin } from './Plugin'
import { loadPlugins } from './plugins'
import { Settings } from './Settings'
import { StatusBar } from './StatusBar'

import * as homedir from 'homedir'
import * as Mousetrap from 'mousetrap'
import * as path from 'path'
import * as nodegit from 'nodegit'


export class JumpFm {
    readonly dialog = new Dialog('dialog', 'dialog-input')
    readonly statusBar = new StatusBar()
    readonly panels = [new Panel(), new Panel()]
    readonly settings = new Settings()
    readonly package = packageJson
    readonly git = nodegit

    private readonly pluginManager = new PluginManager(this)

    switchPanel = () => {
        this.model.activePanel = (this.model.activePanel + 1) % 2
    }


    getActivePanel = (): Panel => {
        return this.panels[this.model.activePanel]
    }

    getPassivePanel = (): Panel => {
        return this.panels[(this.model.activePanel + 1) % 2]
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

            this.bindKeys('increaseFontSize', ['ctrl+='], () => this.model.fontSize++)
            this.bindKeys('decreaseFontSize', ['ctrl+-'], () => this.model.fontSize--)
            this.bindKeys('resetFontSize', ['ctrl+0'], () => this.model.fontSize = 14)

            loadPlugins().forEach(pluginDesc => {
                const s = Date.now()
                try {

                    this.addCss(pluginDesc.css)
                    const Plug = require(pluginDesc.js)
                    const plugin: Plugin = new Plug(this)
                    plugin.onLoad()
                } catch (e) {
                    console.log(e)
                }
                console.log(pluginDesc.js, `[${Date.now() - s} milliseconds]`)
            })

            this.panels.forEach(panel => panel.cd(homedir()))

            this.pluginManager.loadPlugins()

            saveKeyboard(keyboard)
        })
    }

    addCss = (href) => {
        if (!href) return
        const link = document.createElement('link')
        link.setAttribute('rel', 'stylesheet')
        link.setAttribute('href', href)
        document.head.appendChild(link)
    }

    private getKeys = (actionName: string, defaultKeys: string[]): string[] => {
        const keys = keyboard[actionName]
        if (keys && Array.isArray(keys)) return keys
        keyboard[actionName] = defaultKeys
        return defaultKeys
    }

    private bind = (actionName: string,
        defaultKeys: string[],
        action: () => void,
        trap = Mousetrap) => {
        this.getKeys(actionName, defaultKeys).forEach(key =>
            trap.bind(key, () => {
                action()
                return false
            })
        )
    }

    bindKeys = (actionName: string,
        defaultKeys: string[] = [],
        action: () => void = undefined
    ) => {
        if (defaultKeys.length && action)
            this.bind(actionName, defaultKeys, action)
        return {
            filterMode: (filterDefaultKeys: string[] = defaultKeys,
                filterAction: () => void = action,
            ) => {
                this.panels.forEach(panel =>
                    this.bind(
                        'filter:' + actionName,
                        filterDefaultKeys,
                        filterAction,
                        panel.view.filterTrap
                    )
                )
            }
        }
    }

    model = {
        fontSize: 14,
        activePanel: 0,
        panels: this.panels.map(panel => panel.model),
        dialog: this.dialog.model,
        status: this.statusBar.model,
        editableFiles: editableFiles
    }
}
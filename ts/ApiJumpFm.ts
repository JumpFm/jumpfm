import { JumpFm as JumpFmApi } from 'jumpfm-api'
import { PluginManager } from './PluginManager'
import { Dialog } from './ApiDialog'
import {
    editableFiles,
    keyboard,
    saveKeyboard,
    packageJson,
    root
} from './files'
import { Panel } from './ApiPanel'
import { PanelView } from './ApiPanelView'
import { Settings } from './ApiSettings'
import { StatusBar } from './ApiStatusBar'

import { clipboard } from 'electron'
import * as homedir from 'homedir'
import * as Mousetrap from 'mousetrap'
import * as path from 'path'

export class JumpFm implements JumpFmApi {
    readonly dialog = new Dialog('dialog', 'dialog-input')
    readonly statusBar = new StatusBar()
    readonly panels = [new Panel(), new Panel()]
    readonly settings = new Settings()
    readonly package = packageJson
    readonly root = root
    readonly nodegit = require('nodegit')
    readonly electron = require('electron')

    private readonly pluginManager = new PluginManager(this)

    switchPanel = () =>
        this.model.activePanel = (this.model.activePanel + 1) % 2 as 0 | 1


    getActivePanel = (): Panel =>
        this.panels[this.model.activePanel]

    getActivePanelIndex = (): 0 | 1 => {
        return this.model.activePanel
    }

    getPassivePanel = (): Panel =>
        this.panels[(this.model.activePanel + 1) % 2]

    swapPanels = () => {
        const active = this.getActivePanel()
        const passive = this.getPassivePanel()
        const activePath = active.getPath()
        active.cd(passive.getPath())
        passive.cd(activePath)
        this.switchPanel()
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

    model: {
        fontSize: number,
        activePanel: 0 | 1,
        panels: any[],
        dialog: any,
        status: any,
        editableFiles: any[]
    } = {
        fontSize: 14,
        activePanel: 0,
        panels: this.panels.map(panel => panel.model),
        dialog: this.dialog.model,
        status: this.statusBar.model,
        editableFiles: editableFiles
    }

    constructor() {
        this.statusBar.info('plugins', {
            txt: 'Installing plugins (can take a while)...',
            dataTitle: 'This might take some time'
        })

        setTimeout(() => {
            [0, 1].forEach(i => {
                const view = this.panels[i].view = new PanelView(i)
            })

            this.bindKeys('increaseFontSize', ['ctrl+='], () => this.model.fontSize++)
            this.bindKeys('decreaseFontSize', ['ctrl+-'], () => this.model.fontSize--)
            this.bindKeys('resetFontSize', ['ctrl+0'], () => this.model.fontSize = 14)


            this.pluginManager.loadPlugins(e => {
                if (e) {
                    this.statusBar.err('plugins', {
                        txt: 'Error loading plugins'
                        , dataTitle: e
                    })
                    return
                }
                saveKeyboard(keyboard)
                this.panels.forEach(panel => panel.cd(homedir()))
                this.statusBar.clear('plugins')

            })

        }, 1)
    }
}
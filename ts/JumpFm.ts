import { JumpFm as JumpFmApi } from 'jumpfm-api'
import { Panel } from "./Panel"
import { StatusBar } from "./StatusBar"
import { PluginManager } from "./PluginManager";
import { keyboard } from "./files";

import * as mousetrap from 'mousetrap'

export class JumpFm implements JumpFmApi {
    private active: 0 | 1 = 0
    readonly panels: Panel[] = [new Panel(), new Panel()]
    readonly electron = require('electron')
    readonly statusBar: StatusBar = new StatusBar()
    private readonly pluginManager = new PluginManager(this)

    private passive = (): 0 | 1 => (this.active + 1) % 2 as 0 | 1

    private setActive = (i: 0 | 1) => {
        this.active = i
        this.panels[this.active].setActive(true)
        this.panels[this.passive()].setActive(false)
    }

    private getKeys = (actionName: string, defaultKeys: string[]): string[] => {
        const keys = keyboard[actionName]
        if (keys && Array.isArray(keys)) return keys
        keyboard[actionName] = defaultKeys
        return defaultKeys
    }

    getPanelActive = () =>
        this.panels[this.active]

    getPanelPassive = () =>
        this.panels[this.passive()]

    panelsSwap = () => {
        throw new Error("Method not implemented.")
    }

    panelsSwitch = () =>
        this.setActive(this.passive())

    bind = (actionName: string, defaultKeys: string[], action: () => void) => {
        this.getKeys(actionName, defaultKeys).forEach(key =>
            mousetrap.bind(key, () => {
                action()
                return false
            })
        )
    }

    constructor() {
        this.panels.forEach(panel => {
            document
                .getElementById('panels')
                .appendChild(panel.divPanel)
        })


        this.pluginManager.loadAndUpdatePlugins(() => {
            // saveKeyboard(keyboard)
            // this.panels.forEach(panel => panel.cd(homedir()))
            this.panels.forEach(panel => panel.cd('/home/gilad/test'))
            this.setActive(0)
        })
    }
}
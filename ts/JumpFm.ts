import { } from 'electron'
import { JumpFm as JumpFmApi } from 'jumpfm-api'
import { Panel } from "./Panel"
import { StatusBar } from "./StatusBar"
import { PluginManager } from "./PluginManager";
import { Dialog } from "./Dialog";
import { shortway } from "./shortway";
import { Settings } from "./Settings";
import {
    getKeys
    , saveKeyboard
    , root
    , packageJson
    , keyboardPath
    , settingsPath
    , pluginsPackageJson
} from "./files";

import * as homedir from 'homedir'
import * as fs from 'fs'
import * as watch from 'node-watch'

export class JumpFm implements JumpFmApi {
    private active: 0 | 1 = 0
    private readonly divPanels = document.getElementById('panels')
    private readonly pluginManager = new PluginManager(this)
    private readonly watchers: { [name: string]: fs.FSWatcher } = {}

    readonly package = packageJson
    readonly root = root
    readonly settings = new Settings()
    readonly dialog = new Dialog()
    readonly electron: Electron.AllElectron = require('electron')
    readonly panels: Panel[] = [new Panel(), new Panel()]
    readonly statusBar: StatusBar = new StatusBar()
    readonly argv: string[]

    private passive = (): 0 | 1 => (this.active + 1) % 2 as 0 | 1

    private setActive = (i: 0 | 1) => {
        this.active = i
        this.panels[this.active].setActive(true)
        this.panels[this.passive()].setActive(false)
    }

    watchStart = (name, path, then, recursive = false) => {
        this.watchStop(name)
        console.log('WATCH START', name, path)
        setImmediate(() => {
            let to
            this.watchers[name] = watch(path, { recursive: recursive }, () => {
                clearTimeout(to)
                to = setTimeout(then, 10)
            })
        })
    }

    watchStop = (name: string) => {
        if (this.watchers[name]) {
            console.log('WATCH STOP', name)
            this.watchers[name].close()
        }
    }

    getPanelActive = () =>
        this.panels[this.active]

    getPanelPassive = () =>
        this.panels[this.passive()]

    panelsSwap = () => {
        this.active = this.passive()
        const tmp = this.panels[0]
        this.panels[0] = this.panels[1]
        this.panels[1] = tmp
        this.divPanels.insertBefore(this.panels[0].divPanel, this.panels[1].divPanel)
    }

    panelsSwitch = () =>
        this.setActive(this.passive())

    bind = (actionName: string, defaultKeys: string[], action: () => void) => {
        getKeys(actionName, defaultKeys).forEach(combo => {
            const cb = shortway(combo, (e) => {
                e.preventDefault()
                action()
            })
            document.addEventListener('keydown', cb, false)
        })
    }

    constructor(argv: string[]) {
        this.argv = argv
        this.panels.forEach(panel => {
            this.divPanels.appendChild(panel.divPanel)
        })

        const opn = (url) => () => this.electron.shell.openItem(url)
        this.statusBar.buttonAdd('fa-info', 'About', opn('http://jumpfm.org'))
        this.statusBar.buttonAdd('fa-key', 'Keyboard', opn(keyboardPath))
        this.statusBar.buttonAdd('fa-gear', 'Settings', opn(settingsPath))
        this.statusBar.buttonAdd('fa-plug', 'Plugins', opn(pluginsPackageJson))

        this.pluginManager.loadAndUpdatePlugins(() => {
            saveKeyboard()
            this.panels.forEach(panel => panel.cd(homedir()))
            this.setActive(0)
        })
    }
}
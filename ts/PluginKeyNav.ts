import { Plugin } from './Plugin'
import { JumpFm } from './JumpFm'
import { Panel } from './Panel'
import { Item } from './Item'

import * as homedir from 'homedir'
import * as fs from 'fs'
import * as path from 'path'
import { opn } from './opn'

class PluginKeyNav extends Plugin {
    onLoad() {
        const jumpFm = this.jumpFm
        const bind = jumpFm.bindKeys
        const bindFilter = jumpFm.bindKeysFilterMode

        const activePan = () => jumpFm.getActivePanel()
        const step = (d, select = false) => {
            const pan = activePan()
            pan.step(d, select)
            setImmediate(() => pan.view.scroll(pan.getCur()))
        }

        const rowCountInPage = () => activePan().view.getRowCountInPage()

        bind('switchPanel', ['tab'],
            jumpFm.switch,
            () => {
                jumpFm.getActivePanel().view.hideFilter()
                jumpFm.switch()
            }
        )

        bind('up', ['up'], () => step(-1))
        bind('upSelect', ['shift+up'], () => step(-1, true))
        bind('pageUp', ['pageup'], () => step(-rowCountInPage()))
        bind('pageUpSelect', ['shift+pageup'], () => step(-rowCountInPage(), true))

        bind('down', ['down'], () => step(1))
        bind('downSelect', ['shift+down'], () => step(1, true))
        bind('pageDown', ['pagedown'], () => step(rowCountInPage()))
        bind('pageDownSelect', ['shift+pagedown'], () => step(rowCountInPage(), true))

        bind('goStart', ['home'], () => step(-9999))
        bind('goStartSelect', ['shift+home'], () => step(-9999, true))
        bind('goEnd', ['end'], () => step(9999))
        bind('goEndSelect', ['shift+end'], () => step(9999, true))

        bind('selectAll', ['ctrl+a'], () => activePan().selectAll())
        bind('deselectAll', ['esc'], () => {
            activePan().model.filter = ''
            activePan().deselectAll()
        })
        bindFilter('hideFilter', ['esc'], () => activePan().view.hideFilter())

        const enter = () => {
            const pan = activePan()
            const path = pan.getCurItem().path
            if (fs.statSync(path).isDirectory()) pan.cd(path)
            else opn(path)
        }

        bind('enter', ['enter'], enter, () => {
            enter()
            activePan().view.filter.select()
        })

        bind('back', ['backspace'], () => {
            const pan = activePan()
            pan.cd(path.dirname(pan.getPath()))
        })

        bind('homeDir', ['ctrl+home'], () => {
            activePan().cd(homedir())
        })

        bind('openFilter', ['f'], () => activePan().view.showFilter())


        // TODO bind open to right / open to left
    }
}

module.exports = PluginKeyNav
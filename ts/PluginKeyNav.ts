import * as fs from 'fs-extra';
import * as homedir from 'homedir';
import * as path from 'path';

import { opn } from './opn';
import { Panel } from './Panel';
import { Plugin } from './Plugin';

class PluginKeyNav extends Plugin {
    onLoad() {
        const jumpFm = this.jumpFm
        const bind = jumpFm.bindKeys

        const activePan = jumpFm.getActivePanel
        const step = (d, select = false) => {
            const pan = activePan()
            pan.step(d, select)
            setImmediate(() => pan.view.scroll(pan.getCur()))
        }

        const rowCountInPage = activePan().view.getRowCountInPage

        bind('switchPanel', ['tab'], jumpFm.switchPanel).filterMode(['tab'], () => {
            jumpFm.getActivePanel().view.hideFilter()
            jumpFm.switchPanel()
        })

        bind('up', ['up', ']'], () => step(-1)).filterMode()
        bind('upSelect', ['shift+up', 'shift+]'], () => step(-1, true)).filterMode()
        bind('pageUp', ['pageup', 'ctrl+]'], () => step(-rowCountInPage()))
            .filterMode()
        bind('pageUpSelect', ['shift+pageup', 'shift+ctrl+]'],
            () => step(-rowCountInPage(), true)).filterMode()

        bind('down', ['down', '['], () => step(1))
            .filterMode()
        bind('downSelect', ['shift+down', 'shift+['], () => step(1, true)).filterMode()
        bind('pageDown', ['pagedown', 'ctrl+['], () => step(rowCountInPage()))
            .filterMode()
        bind('pageDownSelect', ['shift+pagedown', 'shift+ctrl+['],
            () => step(rowCountInPage(), true)).filterMode()

        bind('goStart', ['home'], () => step(-9999)).filterMode([])
        bind('goStartSelect', ['shift+home'], () => step(-9999, true)).filterMode([])
        bind('goEnd', ['end'], () => step(9999)).filterMode([])
        bind('goEndSelect', ['shift+end'], () => step(9999, true)).filterMode([])

        bind('selectAll', ['ctrl+a'], () => activePan().selectAll()).filterMode()
        bind('deselectAll', ['esc'], () => {
            activePan().model.filter = ''
            activePan().deselectAll()
        }).filterMode([])
        bind('hide').filterMode(['esc'], () => activePan().view.hideFilter())

        const enter = () => {
            const pan = activePan()
            const path = pan.getCurItem().path
            if (fs.statSync(path).isDirectory()) pan.cd(path)
            else opn(path)
        }

        bind('enter', ['enter'], enter).filterMode(['enter'], () => {
            enter()
            activePan().clearFilter()
        })

        bind('back', ['backspace'], () => {
            const pan = activePan()
            pan.cd(path.dirname(pan.getPath()))
        }).filterMode([])

        bind('homeDir', ['ctrl+home'], () => {
            activePan().cd(homedir())
        }).filterMode([])

        bind('openFilter', ['f'], () => activePan().view.showFilter())
        bind('likeThis', ['l'], () => {
            const pan = activePan()
            pan.model.filter = path.extname(pan.getCurItem().path)
        }).filterMode([])
        bind('swapPanels', ['s'], jumpFm.swapPanels).filterMode([])

        const openTo = (source: Panel, dist: Panel) => {
            const item = source.getCurItem()
            dist.cd(
                fs.statSync(item.path).isDirectory() ?
                    item.path :
                    source.getPath()
            )
        }

        bind('openToRight', ['ctrl+right'], () =>
            openTo(
                jumpFm.panels[0],
                jumpFm.panels[1],
            )
        ).filterMode()

        bind('openToLeft', ['ctrl+left'], () =>
            openTo(
                jumpFm.panels[1],
                jumpFm.panels[0],
            )
        ).filterMode()
    }
}

module.exports = PluginKeyNav
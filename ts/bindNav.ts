import { JumpFm } from './JumpFm'
import { Panels } from './Panels'
import { Panel } from './Panel'
import { opn } from './opn'

import * as mousetrap from 'mousetrap'
import * as path from 'path'
import * as homedir from 'homedir'

export function bindNav(jumpFm: JumpFm) {
    function pan(): Panel {
        return jumpFm.panels.getActivePanel()
    }

    // UP DOWN
    const up = (select) => { pan().step(-1, select); return false }
    const down = (select) => { pan().step(1, select); return false }
    mousetrap.bind('up', () => up(false))
    mousetrap.bind('shift+up', () => up(true))
    mousetrap.bind('down', () => down(false))
    mousetrap.bind('shift+down', () => down(true))

    const pageUp = (select) => {
        pan().step(-pan().getRowCountInPage(), select);
        return false
    }
    const pageDown = (select) => {
        pan().step(pan().getRowCountInPage(), select);
        return false
    }
    mousetrap.bind('pageup', () => pageUp(false))
    mousetrap.bind('shift+pageup', () => pageUp(true))
    mousetrap.bind('pagedown', () => pageDown(false))
    mousetrap.bind('shift+pagedown', () => pageDown(true))

    const home = (select) => { pan().step(-9999, select); return false }
    const end = (select) => { pan().step(9999, select); return false }

    mousetrap.bind('home', () => home(false))
    mousetrap.bind('shift+home', () => home(true))
    mousetrap.bind('end', () => end(false))
    mousetrap.bind('shift+end', () => end(true))


    // NAVIGATION
    mousetrap.bind('enter', () => {
        const fullPath = pan().getCurFile().fullPath
        if (pan().getCurFile().stat.isDirectory()) {
            pan().cd(fullPath)
        } else {
            opn(fullPath)
        }
        return false
    })

    mousetrap.bind('backspace', () => {
        const p = pan()
        p.cd(path.dirname(p.getCurDir()))
        return false
    },
        'keyup'
    )
    mousetrap.bind('ctrl+home', () => {
        pan().cd(homedir())
        return false
    },
        'keyup'
    )

    function openDir(here: number) {
        const there = (here + 1) % 2
        const h = jumpFm.panels.get(here)
        const t = jumpFm.panels.get(there)
        const f = h.getCurFile();
        if (!f || !f.stat.isDirectory()) t.cd(h.getCurDir())
        else t.cd(f.fullPath)
        return false
    }

    mousetrap.bind('ctrl+right', () => { return openDir(0) })
    mousetrap.bind('ctrl+left', () => { return openDir(1) })
    mousetrap.bind('alt+left', () => { pan().back(); return false })
    mousetrap.bind('alt+right', () => { pan().forward(); return false })
}
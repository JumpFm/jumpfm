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
    function up() { pan().step(-1); return false }
    function down() { pan().step(1); return false }
    // mousetrap.bind('k', up)
    mousetrap.bind('up', up)
    mousetrap.bind('pageup', () => { pan().step(-10); return false })
    // mousetrap.bind('j', down)
    mousetrap.bind('down', down)
    mousetrap.bind('pagedown', () => { pan().step(10); return false })
    mousetrap.bind('home', () => { pan().step(-9999) })
    mousetrap.bind('end', () => { pan().step(9999) })

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
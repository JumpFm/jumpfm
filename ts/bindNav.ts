import { JumpFm } from './JumpFm'
import { Panels } from './Panels'
import { Panel } from './Panel'
import { opn } from './opn'
import { keys } from './settings'

import * as mousetrap from 'mousetrap'
import * as path from 'path'
import * as homedir from 'homedir'

export function bindNav(jumpFm: JumpFm) {
    function pan(): Panel {
        return jumpFm.panels.getActivePanel()
    }

    // UP DOWN
    const up = (select) => { pan().step(-1, select); return false }
    keys.up.forEach(key => mousetrap.bind(key, () => up(false)))
    keys.upSelect.forEach(key => mousetrap.bind(key, () => up(true)))

    const down = (select) => { pan().step(1, select); return false }
    keys.down.forEach(key => mousetrap.bind(key, () => down(false)))
    keys.downSelect.forEach(key => mousetrap.bind(key, () => down(true)))

    const pageUp = (select) => {
        pan().step(-pan().getRowCountInPage() + 1, select);
        return false
    }
    keys.pgUp.forEach(key => mousetrap.bind(key, () => pageUp(false)))
    keys.pgUpSelect.forEach(key => mousetrap.bind(key, () => pageUp(true)))

    const pageDown = (select) => {
        pan().step(pan().getRowCountInPage() - 1, select);
        return false
    }
    keys.pgDown.forEach(key => mousetrap.bind(key, () => pageDown(false)))
    keys.pgDownSelect.forEach(key => mousetrap.bind(key, () => pageDown(true)))

    const home = (select) => { pan().step(-9999, select); return false }
    keys.home.forEach(key => mousetrap.bind(key, () => home(false)))
    keys.homeSelect.forEach(key => mousetrap.bind(key, () => home(true)))

    const end = (select) => { pan().step(9999, select); return false }
    keys.end.forEach(key => mousetrap.bind(key, () => end(false)))
    keys.endSelect.forEach(key => mousetrap.bind(key, () => end(true)))


    // NAVIGATION
    const enter = () => {
        const fullPath = pan().getCurFile().fullPath
        if (pan().getCurFile().stat.isDirectory()) {
            pan().cd(fullPath)
        } else {
            opn(fullPath)
        }
        return false
    }
    keys.enter.forEach(key => mousetrap.bind(key, enter))

    const back = () => {
        const p = pan()
        p.cd(path.dirname(p.getCurDir()))
        return false
    }
    keys.back.forEach(key => mousetrap.bind(key, back))

    const homeDir = () => {
        pan().cd(homedir())
        return false
    }
    keys.homeDir.forEach(key => mousetrap.bind(key, homeDir))

    function openDir(here: number) {
        const there = (here + 1) % 2
        const h = jumpFm.panels.get(here)
        const t = jumpFm.panels.get(there)
        const f = h.getCurFile();
        if (!f || !f.stat.isDirectory()) t.cd(h.getCurDir())
        else t.cd(f.fullPath)
        return false
    }

    keys.openToRight.forEach(key => mousetrap.bind(key, () => openDir(0)))
    keys.openToLeft.forEach(key => mousetrap.bind(key, () => openDir(1)))

    const historyBack = () => { pan().back; return false }
    keys.historyBack.forEach(key => mousetrap.bind(key, () => historyBack))

    const historyForward = () => { pan().forward; return false }
    keys.historyForward.forEach(key => mousetrap.bind(key, () => historyForward))
}
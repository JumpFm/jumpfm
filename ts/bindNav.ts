import { JumpFm } from './JumpFm'
import { Panels } from './Panels'
import { Panel } from './Panel'
import { opn } from './opn'
import { keys } from './settings'
import { Table } from './Table'

import * as mousetrap from 'mousetrap'
import * as path from 'path'
import * as homedir from 'homedir'

export function bindNav(jumpFm: JumpFm) {
    const pan = () => jumpFm.panels.getActivePanel()

    const tables = [
        new Table('tbody0'),
        new Table('tbody1')
    ]
    const table = () => tables[jumpFm.panels.model.active]
    const step = (d: number, select: boolean) => {
        const p = pan()
        p.step(d, select)
        table().scroll(p.getCur())
        return false
    }

    const up = (select) => step(-1, select)
    const down = (select) => step(1, select)

    const pageUp = (select) => step(-table().getRowCountInPage() + 1, select);
    const pageDown = (select) => step(table().getRowCountInPage() - 1, select);

    const home = (select) => step(-9999, select)
    const end = (select) => step(9999, select)

    const enter = () => {
        const fullPath = pan().getCurFile().fullPath
        if (pan().getCurFile().stat.isDirectory()) {
            pan().cd(fullPath)
        } else {
            opn(fullPath)
        }
        return false
    }

    const back = () => {
        const p = pan()
        p.cd(path.dirname(p.getCurDir()))
        return false
    }

    const homeDir = () => {
        pan().cd(homedir())
        return false
    }

    const historyBack = () => { pan().back(); return false }
    const historyForward = () => { pan().forward(); return false }

    const openDir = (here: number) => {
        const there = (here + 1) % 2
        const h = jumpFm.panels.getPanel(here)
        const t = jumpFm.panels.getPanel(there)
        const f = h.getCurFile();
        if (!f || !f.stat.isDirectory()) t.cd(h.getCurDir())
        else t.cd(f.fullPath)
        return false
    }

    const jump = () => {
        jumpFm.jump.open();
        return false;
    }

    keys.up.forEach(key => mousetrap.bind(key, () => up(false)))
    keys.upSelect.forEach(key => mousetrap.bind(key, () => up(true)))

    keys.down.forEach(key => mousetrap.bind(key, () => down(false)))
    keys.downSelect.forEach(key => mousetrap.bind(key, () => down(true)))

    keys.pgUp.forEach(key => mousetrap.bind(key, () => pageUp(false)))
    keys.pgUpSelect.forEach(key => mousetrap.bind(key, () => pageUp(true)))

    keys.pgDown.forEach(key => mousetrap.bind(key, () => pageDown(false)))
    keys.pgDownSelect.forEach(key => mousetrap.bind(key, () => pageDown(true)))

    keys.home.forEach(key => mousetrap.bind(key, () => home(false)))
    keys.homeSelect.forEach(key => mousetrap.bind(key, () => home(true)))

    keys.end.forEach(key => mousetrap.bind(key, () => end(false)))
    keys.endSelect.forEach(key => mousetrap.bind(key, () => end(true)))

    keys.enter.forEach(key => mousetrap.bind(key, () => enter()))

    keys.back.forEach(key => mousetrap.bind(key, () => back()))

    keys.homeDir.forEach(key => mousetrap.bind(key, () => homeDir()))

    keys.openToRight.forEach(key => mousetrap.bind(key, () => openDir(0)))
    keys.openToLeft.forEach(key => mousetrap.bind(key, () => openDir(1)))

    keys.historyBack.forEach(key => mousetrap.bind(key, () => historyBack()))
    keys.historyForward.forEach(key => mousetrap.bind(key, () => historyForward()))

    keys.jump.forEach(key => mousetrap.bind(key, () => jump()))
}
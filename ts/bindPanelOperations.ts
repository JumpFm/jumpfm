import { Panels } from './Panels'
import { Panel } from './Panel'
import { Q } from './Q'
import { JumpFm } from './JumpFm'
import { keys } from './settings'

import * as mousetrap from 'mousetrap'
import * as shell from 'shelljs'

export function bindPanelOperations(jumpFm: JumpFm) {
    const act = () => jumpFm.panels.getActivePanel()
    const pas = () => jumpFm.panels.getPassivePanel()

    const switchPanel = () => {
        jumpFm.panels.switch()
        return false
    }

    const copy = () => {
        jumpFm.q.cp(
            act().getSelectedFilesFullPath(),
            pas().getCurDir()
        )
        act().deselectAll()
        return false
    }

    const move = () => {
        shell.mv(
            act().getSelectedFilesFullPath(),
            pas().getCurDir()
        )
        act().deselectAll()
        return false
    }

    const swap = () => {
        const pwd0 = act().getCurDir()
        const pwd1 = pas().getCurDir()
        act().cd(pwd1)
        pas().cd(pwd0)
        return false
    }

    keys.switch.forEach(key => mousetrap.bind(key, switchPanel))
    keys.copy.forEach(key => mousetrap.bind(key, copy))
    keys.move.forEach(key => mousetrap.bind(key, move))
    keys.swap.forEach(key => mousetrap.bind(key, swap))
}
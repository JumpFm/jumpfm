import { Panels } from './Panels'
import { Panel } from './Panel'
import { JumpFm } from './JumpFm'
import { keys } from './settings'

import * as mousetrap from 'mousetrap'


export function bindSelection(jumpFm: JumpFm) {
    const selection = keys.selection

    function pan(): Panel {
        return jumpFm.panels.getActivePanel()
    }

    const toggle = () => {
        pan().toggleSel()
        return false
    }

    selection.toggle.forEach(key => mousetrap.bind(key, toggle))

    const clear = () => {
        pan().clearFilter()
        pan().deselectAll()
        return false
    }
    selection.clear.forEach(key => mousetrap.bind(key, clear))

    const all = () => {
        pan().selectAll();
        return false;
    }
    selection.all.forEach(key => mousetrap.bind(key, all))
}
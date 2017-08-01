import { Panels } from './Panels'
import { Panel } from './Panel'
import { JumpFm } from './JumpFm'

import * as mousetrap from 'mousetrap';


export function bindSelection(jumpFm: JumpFm) {
    function pan(): Panel {
        return jumpFm.panels.getActivePanel()
    }

    // SELECTION
    mousetrap.bind('space', () => { pan().toggleSel(); return false; });
    mousetrap.bind('esc', () => {
        pan().clearFilter();
        pan().deselectAll();
        return false;
    });
    mousetrap.bind('ctrl+a', () => { pan().selectAll(); return false; });
}
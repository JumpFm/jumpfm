import { Panels } from './Panels'
import { Panel } from './Panel'
import { Q } from './Q'
import { JumpFm } from './JumpFm'

import * as mousetrap from 'mousetrap'
import * as shell from 'shelljs'

export function bindPanelOperations(jumpFm: JumpFm) {
    function act(): Panel {
        return jumpFm.panels.getActivePanel()
    }

    function pas(): Panel {
        return jumpFm.panels.passive()
    }

    // PANEL
    mousetrap.bind('tab', () => {
        jumpFm.panels.switch();
        return false;
    });

    // COPY
    mousetrap.bind('f5', () => {
        jumpFm.q.cp(
            act().getSelectedFilesFullPath(),
            pas().getCurDir()
        );
        act().deselectAll();
        return false;
    });

    // MOVE
    mousetrap.bind('f6', () => {
        shell.mv(
            act().getSelectedFilesFullPath(),
            pas().getCurDir()
        );
        act().deselectAll();
        return false;
    });


    // SWIPE
    mousetrap.bind('s', () => {
        const pwd0 = act().getCurDir()
        const pwd1 = pas().getCurDir()
        act().cd(pwd1)
        pas().cd(pwd0)
        return false;
    });
}
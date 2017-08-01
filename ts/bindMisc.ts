const clipboard = require('electron').clipboard;

import { JumpFm } from './JumpFm'
import { Panels } from './Panels'
import { Panel } from './Panel'
import { Dialog } from './Dialog'
import { Jump } from './Jump'

import * as path from 'path';
import * as mousetrap from 'mousetrap';
import * as keycode from 'keycode';

export function bindMisc(jumpFm: JumpFm) {
    function pan(): Panel {
        return jumpFm.panels.getActivePanel()
    }

    const statusBar = jumpFm.statusBar
    // CLIPBOARD
    mousetrap.bind('p', () => {
        const fullPath = pan().getCurFile().fullPath
        statusBar.info("Clipboard: " + fullPath)
        clipboard.writeText(fullPath);
    });

    // FILTER
    mousetrap.bind('f', () => {
        const filter = document.getElementById("filter" + jumpFm.panels.model.active)
        filter.focus()
        return false;
    });

    // SHOW LIKE THIS
    mousetrap.bind('l', () => {
        const pan = jumpFm.panels.getActivePanel()
        const ext = path.extname(pan.getCurFile().fullPath)
        statusBar.warn("Filter: " + ext)
        pan.filter(ext)
    })

    // FLAT VIEW
    mousetrap.bind('r', () => {
        pan().toggleFlatMode()
        return false
    })

    // HIDDEN FILES
    mousetrap.bind('h', () => {
        pan().toggleShowHidden()
        return false
    })

    // JUMP
    mousetrap.bind('j', () => {
        jumpFm.jump.open((pwd) => {
            pan().cd(pwd);
        });
        return false;
    });
}
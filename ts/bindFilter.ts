const clipboard = require('electron').clipboard;

import { JumpFm } from './JumpFm'
import { Panels } from './Panels'
import { Panel } from './Panel'
import { keys } from './settings'

import * as path from 'path';
import * as mousetrap from 'mousetrap';

export function bindFilter(jumpFm: JumpFm) {
    const pan = () => jumpFm.panels.getActivePanel()

    const show = () => {
        const id = 'filter' + jumpFm.panels.model.active
        const filter = document.getElementById(id) as HTMLInputElement
        filter.select()
        return false;
    }

    const likeThis = () => {
        const curFile = pan().getCurFile()
        if (!curFile) return
        const ext = path.extname(curFile.fullPath)
        if (!ext) return
        jumpFm.statusBar.warn('Filter: ' + ext)
        pan().filter(ext)
    }

    const toggleFlatMode = () => {
        pan().toggleFlatMode()
        return false
    }

    const toggleHidden = () => {
        pan().toggleShowHidden()
        return false
    }


    keys.filter.forEach(key => mousetrap.bind(key, show))
    keys.likeThis.forEach(key => mousetrap.bind(key, likeThis))
    keys.toggleFlatMode.forEach(key => mousetrap.bind(key, toggleFlatMode))
    keys.toggleHiddenFiles.forEach(key => mousetrap.bind(key, toggleHidden))

    const blur = (e: KeyboardEvent) => {
        (e.target as HTMLInputElement).blur()
        return false
    }

    ['filter0', 'filter1'].forEach(filterId => {
        const trap = new mousetrap(document.getElementById(filterId));
        ['esc', 'tab'].forEach(key => {
            trap.bind(key, blur)
        })
        Object.keys(keys.filterMod).forEach(cmd => {
            keys.filterMod[cmd].forEach(key => {
                trap.bind(key, () => {
                    mousetrap.trigger(keys[cmd][0])
                    return false
                })
            })
        })
    })
}
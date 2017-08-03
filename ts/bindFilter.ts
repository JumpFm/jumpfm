const clipboard = require('electron').clipboard;

import { JumpFm } from './JumpFm'
import { Panels } from './Panels'
import { Panel } from './Panel'
import { keys } from './settings'

import * as path from 'path';
import * as mousetrap from 'mousetrap';
import * as keycode from 'keycode';

export function bindFilter(jumpFm: JumpFm) {
    const pan = () => jumpFm.panels.getActivePanel()

    const show = () => {
        const filter = document.getElementById('filter' + jumpFm.panels.model.active)
        filter.focus()
        return false;
    }

    const likeThis = () => {
        const pan = jumpFm.panels.getActivePanel()
        const ext = path.extname(pan.getCurFile().fullPath)
        jumpFm.statusBar.warn('Filter: ' + ext)
        pan.filter(ext)
    }

    const toggleFlatMode = () => {
        pan().toggleFlatMode()
        return false
    }

    const toggleHidden = () => {
        pan().toggleShowHidden()
        return false
    }

    const filter = keys.filter

    filter.show.forEach(key => mousetrap.bind(key, show))
    filter.likeThis.forEach(key => mousetrap.bind(key, likeThis))
    filter.toggleFlatMode.forEach(key => mousetrap.bind(key, toggleFlatMode))
    filter.toggleHidden.forEach(key => mousetrap.bind(key, toggleHidden))
}
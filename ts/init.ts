import { JumpFm } from './JumpFm'
import { JumpDb } from './JumpDb'
import { Panels } from './Panels'
import { Dialog } from './Dialog'
import { Jump } from './Jump'
import { StatusBar } from './StatusBar'
import { Q } from './Q'
import { opn } from './opn'
import { bind } from './bind'

import {
    miscFullPath,
    pluginsFullPath,
    keysFullPath
} from './settings'


import * as fileSize from 'filesize'
import * as moment from 'moment'

import * as mousetrap from 'mousetrap'
import * as keycode from 'keycode'

import * as homedir from 'homedir'
import * as Vue from 'vue/dist/vue.min.js'

document.addEventListener('DOMContentLoaded', () => {
    const jumpFm = new JumpFm()

    Vue.filter('formatDate', function (date) { return moment(date).format('MM/DD/YYYY hh:mm'); });
    Vue.filter('fileSize', function (size) { return fileSize(size); });

    const data: any = jumpFm.model
    data.fontSize = 14
    mousetrap.bind('ctrl+=', () => { data.fontSize++ })
    mousetrap.bind('ctrl+-', () => { data.fontSize-- })
    mousetrap.bind('ctrl+0', () => { data.fontSize = 14 })

    new Vue({
        el: '#app',
        data: data
    })


    // SETTINGS
    function edit(id: string, fullPath: string) {
        document.getElementById(id).addEventListener("click", () => {
            opn(fullPath);
        }, false);
    }

    edit('editMisc', miscFullPath)
    edit('editPlugins', pluginsFullPath)
    edit('editKeys', keysFullPath)

    // KEY BINDING
    bind(jumpFm)

    // INIT
    jumpFm.init()
    const panels = jumpFm.panels
    panels.getPanel(0).cd(homedir())
    panels.getPanel(1).cd(homedir())

}, false)
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


    // FILTERS
    function filterKeyDown(e: KeyboardEvent) {
        const kc = keycode(e.keyCode)
        const filter = e.target as HTMLInputElement
        if (['esc', 'tab'].indexOf(kc) > -1) filter.blur()
        if (['up', 'down', 'enter', 'tab'].indexOf(kc) > -1) {
            e.preventDefault()
            mousetrap.trigger(kc)
        }
    }

    document.getElementById('filter0').addEventListener('keydown', filterKeyDown, true)
    document.getElementById('filter1').addEventListener('keydown', filterKeyDown, true)

    // KEY BINDING
    bind(jumpFm)

    // SETTINGS
    function edit(id: string, fullPath: string) {
        document.getElementById(id).addEventListener("click", () => {
            opn(fullPath);
        }, false);
    }

    edit('editMisc', miscFullPath)
    edit('editPlugins', pluginsFullPath)
    edit('editKeys', keysFullPath)
    // INIT
    jumpFm.init()
    const panels = jumpFm.panels
    panels.get(0).cd(homedir())
    panels.get(1).cd(homedir())

}, false)
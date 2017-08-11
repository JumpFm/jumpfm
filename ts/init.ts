const time = Date.now()

import { JumpFm } from './JumpFm'
import { opn } from './opn'
import { root } from './files'

import * as fileSize from 'filesize'
import * as moment from 'moment'
import * as path from 'path'
import * as Vue from 'vue/dist/vue.min.js'

document.addEventListener('DOMContentLoaded', () => {
    Vue.filter('formatDate', date =>
        date && moment(date).format('DD/MM/YYYY hh:mm') || '--'
    )

    Vue.filter('fileSize', size =>
        size && fileSize(size) || '--'
    )

    new Vue({
        el: '#app',
        data: new JumpFm().model,
        methods: {
            edit: name => {
                const file = path.join(root, name)
                console.log(file)
                opn(file)
            }
        }
    })

    console.log(Date.now() - time, 'milliseconds')
}, false)
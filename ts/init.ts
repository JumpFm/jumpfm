const time = Date.now()

import { JumpFm } from './JumpFm'

import * as fileSize from 'filesize'
import * as moment from 'moment'
import * as Vue from 'vue/dist/vue.min.js'

document.addEventListener('DOMContentLoaded', () => {
    Vue.filter('formatDate', date =>
        date && moment(date).format('MM/DD/YYYY hh:mm') || '--'
    )

    Vue.filter('fileSize', size =>
        size && fileSize(size) || '--'
    )

    new Vue({
        el: '#app',
        data: new JumpFm().model
    })

    console.log(Date.now() - time, 'milliseconds')
}, false)
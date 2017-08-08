const time = Date.now()

import { JumpFm } from './JumpFm'

import * as fileSize from 'filesize'
import * as moment from 'moment'
import * as Vue from 'vue/dist/vue.min.js'

document.addEventListener('DOMContentLoaded', () => {
    Vue.filter('formatDate', function (date) { return moment(date).format('MM/DD/YYYY hh:mm'); });
    Vue.filter('fileSize', function (size) { return fileSize(size); });

    const jumpFm = new JumpFm()

    new Vue({
        el: '#app',
        data: jumpFm.model
    })

    console.log(Date.now() - time, 'millisecons')
}, false)
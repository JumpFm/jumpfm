const moment = require('moment')
const fs = require('fs');
const cmd = require('node-cmd');
const dateFormat = require('dateformat');
const fileSize = require('filesize');


document.addEventListener('DOMContentLoaded', function() {

    Vue.filter('formatDate', function(date) {
        return moment(date).format('MM/DD/YYYY hh:mm');
    });

    Vue.filter('fileSize', function(size) {
        return fileSize(size);
    });

    const app = new Vue({
        el: '#app',
        data: {
            files: [],
            cur: 0,
        },
    })


    var path = '/home/gilad';
    fs.readdir(path, (err, files) => {
        console.log(files);
        app.files = files.map((file) => {
            return {
                name: file,
                stat: fs.statSync(path + '/' + file),
            }
        });
    });

    // cmd.get('ls -a /home/gilad/work', (err, data, stderr) => {
    //     console.log(data);
    // });
}, false);
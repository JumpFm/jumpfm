document.addEventListener('DOMContentLoaded', () => {
    console.time('main')
    new (require('./js/JumpFm.js').JumpFm)(require('electron').remote.getGlobal('argv'))
    console.timeEnd('main')
}, false)
document.addEventListener('DOMContentLoaded', () => {
    console.time('main');
    new (require('./js/JumpFm.js').JumpFm)(process.argv);
    console.timeEnd('main');
}, false);
//# sourceMappingURL=main.js.map
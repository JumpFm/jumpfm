document.addEventListener('DOMContentLoaded', () => {
    console.time('main');
    new (require('./js/JumpFm.js').JumpFm)();
    console.timeEnd('main');
}, false);
//# sourceMappingURL=main.js.map
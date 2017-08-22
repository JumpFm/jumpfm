document.addEventListener('DOMContentLoaded', () => {
    const time = Date.now();
    new (require('./js/JumpFm.js').JumpFm)();
    console.log(Date.now() - time, 'milliseconds');
}, false);
//# sourceMappingURL=main.js.map
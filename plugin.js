class MyPlugin {
    constructor(jumpFm) {
        this.jumpFm = jumpFm
    }

    onLoad() {
        this.jumpFm.statusBar.warn('me', 'ʘ‿ʘ')
    }
}

module.exports = MyPlugin
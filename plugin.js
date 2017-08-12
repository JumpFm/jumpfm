class MyPlugin {
    constructor(jumpFm) {
        this.jumpFm = jumpFm
    }

    onLoad() {
        this.jumpFm.statusBar.info('me', 'me plugin :)')
    }
}

module.exports = MyPlugin
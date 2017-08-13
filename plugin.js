class MyPlugin {
    constructor(jumpFm) {
        this.jumpFm = jumpFm
    }

    onLoad() {
        this.jumpFm.statusBar.info('myPlugin', 'ʘ‿ʘ')
    }
}

module.exports = MyPlugin
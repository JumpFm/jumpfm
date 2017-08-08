import { JumpFm } from './JumpFm'
import { Plugin } from './Plugin'

class Jump extends Plugin {
    constructor(jumpFm: JumpFm) {
        super(jumpFm)
    }

    onLoad(): void {
        console.log('onLoad')
        const jumpFm = this.jumpFm
        jumpFm.keys.bind('jump', 'j', () => {
            jumpFm.dialog.open({
                label: 'Jump',
                onAccept: val => {
                    console.log(val)
                },
            })
        })
    }
}

module.exports = Jump

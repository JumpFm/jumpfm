import { JumpFm } from './JumpFm'
import { Plugin } from './Plugin'

class Jump extends Plugin {
    constructor(jumpFm: JumpFm) {
        super(jumpFm)
    }

    onLoad(): void {
        console.log('onLoad')
    }
}

module.exports = Jump

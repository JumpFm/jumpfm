import { JumpFm } from './JumpFm'

export abstract class Plugin {
    readonly jumpFm: JumpFm

    constructor(jumpFm: JumpFm) {
        this.jumpFm = jumpFm
    }

    abstract onLoad(): void
}
import { JumpFm } from './JumpFm'

export abstract class Plugin {
    protected readonly jumpFm

    constructor(jumpFm: JumpFm) {
        this.jumpFm = jumpFm
    }

    abstract onLoad(): void
}
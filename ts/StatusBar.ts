export type MsgType = "info" | "warn" | "err"

export class StatusBar {

    readonly model: { txt: string, type: MsgType } = {
        txt: "Welcome to JumpFm",
        type: "info"
    }

    private update = (msg: string, type: MsgType = 'info') => {
        this.model.txt = msg
        this.model.type = type
    }

    info = (msg) => this.update(msg)
    warn = (msg) => this.update(msg, 'warn')
    err = (msg) => this.update(msg, 'err')
    clear = () => this.update('')
}
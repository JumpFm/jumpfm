type Type = "info" | "warn" | "err"

interface Msg {
    txt: string
    type: Type
}

export class StatusBar {

    model = {
        msgs: [{
            txt: '',
            type: 'info'
        }]
    }

    private msgs: { [key: string]: Msg } = {}

    private set = (key: string, msg: Msg) => {
        this.msgs[key] = msg
    }

    private update = () => {
        this.model.msgs = Object.keys(this.msgs).map(key => this.msgs[key])
    }

    private setAndUpdate = (key: string, msg: Msg) => {
        this.set(key, msg)
        this.update()
    }

    info = (key: string, txt: string) => this.setAndUpdate(key, { txt: txt, type: 'info' })
    warn = (key: string, txt: string) => this.setAndUpdate(key, { txt: txt, type: 'warn' })
    err = (key: string, txt: string) => this.setAndUpdate(key, { txt: txt, type: 'err' })
    clear = (key: string) => {
        delete this.msgs[key]
        this.update()
    }
}
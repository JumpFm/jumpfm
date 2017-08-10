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

    private set = (key: string, msg: Msg, clearTimeout: number = 0) => {
        this.msgs[key] = msg
        if (clearTimeout) setTimeout(() => this.clear(key), clearTimeout)
    }

    private update = () => {
        this.model.msgs = Object.keys(this.msgs).map(key => this.msgs[key])
    }

    private setAndUpdate = (key: string, msg: Msg, clearTimeout: number = 0) => {
        this.set(key, msg, clearTimeout)
        this.update()
    }

    info = (key: string, txt: string, clearTimeout: number = 0) =>
        this.setAndUpdate(key, { txt: txt, type: 'info' }, clearTimeout)
    warn = (key: string, txt: string, clearTimeout: number = 0) =>
        this.setAndUpdate(key, { txt: txt, type: 'warn' }, clearTimeout)
    err = (key: string, txt: string, clearTimeout: number = 0) =>
        this.setAndUpdate(key, { txt: txt, type: 'err' }, clearTimeout)
    clear = (key: string) => {
        delete this.msgs[key]
        this.update()
    }
}
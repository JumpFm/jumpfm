import { Msg } from 'jumpfm-api'

export class StatusBar {
    model = {
        msgs: [{
            txt: '',
            classes: ['info']
        }]
    }

    private msgs: { [key: string]: Msg } = {}

    private set = (key: string, msg: Msg) => {
        this.msgs[key] = msg
    }

    private update = () => {
        this.model.msgs = Object.values(this.msgs)
    }

    private setAndUpdate = (key: string, msg: Msg) => {
        this.set(key, msg)
        this.update()
    }

    msg = (classes: string[]) =>
        (key: string, txt: string, clearTimeout: number = 0) => {
            this.setAndUpdate(key, {
                txt: txt,
                classes: classes
            })

            if (clearTimeout) setTimeout(() =>
                this.clear(key)
                , clearTimeout);
        }

    info = this.msg(['info'])
    warn = this.msg(['warn'])
    err = this.msg(['err'])

    clear = (key: string) => {
        delete this.msgs[key]
        this.update()
    }
}
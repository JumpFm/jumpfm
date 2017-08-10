interface Msg {
    txt: string
    classes: string[]
}

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
        this.model.msgs = Object.keys(this.msgs).map(key => this.msgs[key])
    }

    private setAndUpdate = (key: string, msg: Msg) => {
        this.set(key, msg)
        this.update()
    }

    msg = (key: string,
        txt: string,
        classes: string[] = ['info'],
        clearTimeout: number = 0
    ) => {
        this.setAndUpdate(key, {
            txt: txt,
            classes: classes
        })

        if (clearTimeout) setTimeout(() =>
            this.clear(key)
            , clearTimeout);
    }

    clear = (key: string) => {
        delete this.msgs[key]
        this.update()
    }
}
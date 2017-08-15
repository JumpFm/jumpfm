import { StatusBar as StatusBarApi, Msg, StyledMsg } from 'jumpfm-api'

export class StatusBar implements StatusBarApi {
    model: { msgs: StyledMsg[] } = {
        msgs: [],
    }

    readonly msgs: { [key: string]: StyledMsg } = {}

    private updateModel = () => {
        this.model.msgs = Object.values(this.msgs)
    }

    msg = (classes: string[]) =>
        (key: string, msg: Msg, clearTimeout: number = 0) => {
            this.msgs[key] = {
                classes: classes,
                dataTitle: msg.dataTitle,
                txt: msg.txt
            }

            this.updateModel()

            if (clearTimeout) setTimeout(() =>
                this.clear(key)
                , clearTimeout);
        }

    info = this.msg(['info'])
    warn = this.msg(['warn'])
    err = this.msg(['err'])

    clear = (key: string) => {
        delete this.model.msgs[key]
        this.updateModel()
    }
}
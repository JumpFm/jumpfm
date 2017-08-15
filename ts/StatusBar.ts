import { StatusBar as StatusBarApi, Msg, StyledMsg } from 'jumpfm-api'

export class StatusBar implements StatusBarApi {
    model: {
        msgs: { [key: string]: StyledMsg },
        getMsgs: () => StyledMsg[]
    } = {
        msgs: { 'dbg': { txt: 'dbg', dataTitle: 'working', classes: ['info'] } },
        getMsgs: () =>
            Object.values(this.model.msgs)

    }

    private

    msg = (classes: string[]) =>
        (key: string, msg: Msg, clearTimeout: number = 0) => {
            this.model.msgs[key] = {
                classes: classes,
                dataTitle: msg.dataTitle,
                txt: msg.txt
            }

            if (clearTimeout) setTimeout(() =>
                this.clear(key)
                , clearTimeout);
        }

    info = this.msg(['info'])
    warn = this.msg(['warn'])
    err = this.msg(['err'])

    clear = (key: string) => {
        delete this.model.msgs[key]
    }
}
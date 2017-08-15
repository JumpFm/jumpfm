import {
    Dialog as DialogApi
    , DialogSpec
    , Suggestion
} from 'jumpfm-api'

import * as Mousetrap from 'mousetrap'

export class Dialog implements DialogApi {
    view: HTMLDivElement
    input: HTMLInputElement

    constructor(dialogId, inputId) {
        setImmediate(() => {
            this.view = document.getElementById('dialog') as HTMLDivElement
            this.input = document.getElementById('dialog-input') as HTMLInputElement

            const mousetrap = new Mousetrap(this.input)

            this.input.addEventListener('blur', this.close, false)

            mousetrap.bind('esc', this.close)
            mousetrap.bind('enter', () => {
                this.close()
                this.onAccept(
                    this.input.value,
                    this.model.sug[this.model.cur]
                )
                return false
            })

            mousetrap.bind('down', () => {
                this.model.cur = Math.min(this.model.cur + 1, this.model.sug.length - 1)
                return false
            })

            mousetrap.bind('up', () => {
                this.model.cur = Math.max(this.model.cur - 1, 0)
                return false
            })

            this.input.addEventListener('keyup', () => {
                this.model.sug = this.onChange(this.input.value)
            }, false)
        })
    }

    private close = () => {
        this.view.style.display = 'none'
    }

    onAccept = (val: string, sug: Suggestion) => { }
    onChange = val => []

    open = (spec: DialogSpec) => {
        this.model.sug = []
        this.model.label = spec.label
        this.model.cur = 0

        this.view.style.display = 'block'
        this.input.value = ''
        this.input.select()

        spec.onOpen && spec.onOpen(this.input)
        this.onChange = spec.onChange || (val => [])
        this.onAccept = spec.onAccept
    }

    model = {
        label: 'Dialog',
        sug: [],
        cur: 0
    }
}
import { Dialog as DialogApi, DialogSpec, Suggestion } from 'jumpfm-api'

import * as Mousetrap from 'mousetrap'

export class Dialog implements DialogApi {
    private readonly divDialog: HTMLDivElement =
    document.getElementById('dialog') as HTMLDivElement

    private readonly divLabel: HTMLDivElement =
    document.getElementById('dialog-label') as HTMLDivElement

    private readonly input: HTMLInputElement =
    document.getElementById('dialog-input') as HTMLInputElement

    private suggestions: Suggestion[] = []

    private onAccept = (val: string, sug: Suggestion) => { }
    private onChange = val => []
    private cur: number

    constructor(dialogId, inputId) {

        const mousetrap = new Mousetrap(this.input)

        this.input.addEventListener('blur', this.close, false)

        mousetrap.bind('esc', this.close)
        mousetrap.bind('enter', () => {
            this.close()
            this.onAccept(
                this.input.value,
                this.suggestions[this.cur]
            )
            return false
        })

        mousetrap.bind('down', () => {
            this.cur = Math.min(this.cur + 1, this.suggestions.length - 1)
            return false
        })

        mousetrap.bind('up', () => {
            this.cur = Math.max(this.cur - 1, 0)
            return false
        })

        this.input.addEventListener('keyup', () => {
            this.suggestions = this.onChange(this.input.value)
        }, false)
    }

    private close = () => {
        this.divDialog.style.display = 'none'
    }

    open = (spec: DialogSpec) => {
        this.suggestions = []
        this.divLabel.textContent = spec.label
        this.cur = 0

        this.divDialog.style.display = 'block'
        this.input.value = ''
        this.input.select()

        spec.onOpen && spec.onOpen(this.input)
        this.onChange = spec.onChange || (val => [])
        this.onAccept = spec.onAccept
    }
}
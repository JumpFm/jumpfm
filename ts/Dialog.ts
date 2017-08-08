import * as Mousetrap from 'mousetrap'

interface Spec {
    label: string,
    onOpen: (input: HTMLInputElement) => void,
    onAccept: (val: string) => void,
    onChange: (val: string) => string[]
}

export class Dialog {
    dialog
    input

    onAccept = val => { }
    onChange = val => ['ba<b>b</b>a', 'nana']

    private close = () => {
        this.dialog.style.display = 'none'
    }

    open = (spec: Spec) => {
        this.onAccept = spec.onAccept
        this.onChange = spec.onChange

        this.dialog.style.display = 'block'
        this.input.select()
        this.model.label = spec.label

        spec.onOpen && spec.onOpen(this.input)
    }

    model = {
        label: 'Dialog',
        sug: [],
        cur: 0
    }

    onLoad = () => {
        this.dialog = document.getElementById('dialog') as HTMLDivElement
        this.input = document.getElementById('dialog-input') as HTMLInputElement

        const mousetrap = new Mousetrap(this.input)

        this.input.addEventListener('blur', this.close, false)

        mousetrap.bind('esc', this.close)
        mousetrap.bind('enter', () => {
            this.close()
            this.onAccept(this.input.value)
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
    }
}
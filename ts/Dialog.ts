import { Dialog as DialogApi, DialogSpec, Suggestion } from 'jumpfm-api'
import { shortway } from "./shortway";


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

    constructor() {
        const on = (type, action, capture = false) =>
            this.input.addEventListener(type, action, capture)

        on('keydown', e => {
            console.log('dialog')
            e.stopPropagation()
        })
        on('blur', this.close)
        on('keydown', shortway('esc', this.close))
        on('keydown', shortway('enter', () => {
            this.close()
            this.onAccept(
                this.input.value,
                this.suggestions[this.cur]
            )
            return false
        }))

        // mousetrap.bind('down', () => {
        //     this.cur = Math.min(this.cur + 1, this.suggestions.length - 1)
        //     return false
        // })

        // mousetrap.bind('up', () => {
        //     this.cur = Math.max(this.cur - 1, 0)
        //     return false
        // })

        // this.input.addEventListener('input', () => {
        //     this.suggestions = this.onChange(this.input.value)
        // }, false)
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
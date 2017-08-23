import { Dialog as DialogApi, DialogSpec, Suggestion } from 'jumpfm-api'
import { shortway } from "./shortway";

interface SuggestionLi extends Suggestion {
    li: HTMLLIElement
}

export class Dialog implements DialogApi {
    private readonly divDialog: HTMLDivElement =
    document.getElementById('dialog') as HTMLDivElement

    private readonly divLabel: HTMLDivElement =
    document.getElementById('dialog-label') as HTMLDivElement

    private readonly input: HTMLInputElement =
    document.getElementById('dialog-input') as HTMLInputElement

    private readonly olSug: HTMLOListElement =
    document.getElementById('dialog-sug') as HTMLOListElement

    private suggestions: SuggestionLi[] = []

    private onAccept = (val: string, sug: Suggestion) => { }
    private suggest = val => []
    private cur: number

    constructor() {
        const on = (type, action, capture = false) =>
            this.input.addEventListener(type, action, capture)

        on('keydown', e => {
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
        }))


        on('keydown', shortway('down', () =>
            this.setCur(this.cur + 1)
        ))

        on('keydown', shortway('up', () =>
            this.setCur(this.cur - 1)
        ))

        on('input', this.updateSuggestions)
    }

    private updateSuggestions = () => {
        this.suggestions =
            this.suggest(this.input.value)
                .map(sug => {
                    const li = document.createElement('li')
                    li.innerHTML = sug.html
                    sug.li = li
                    return sug
                })
        this.clearSuggestions()
        this.suggestions.forEach(sug => {
            this.olSug.appendChild(sug.li)
        })
        const curSuggestion = this.suggestions[this.cur = 0]
        if (curSuggestion) curSuggestion.li.setAttribute('cur', '')
    }

    private setCur = (i: number) => {
        if (!this.suggestions.length) return
        const curSug = this.suggestions[this.cur]
        if (curSug) curSug.li.removeAttribute('cur')
        this.cur = Math.max(0, Math.min(i, this.suggestions.length - 1))
        this.suggestions[this.cur].li.setAttribute('cur', '')
    }

    private clearSuggestions = () => {
        while (this.olSug.lastChild) this.olSug.removeChild(this.olSug.lastChild)
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
        this.suggest = spec.suggest || (val => [])
        this.onAccept = spec.onAccept
    }
}
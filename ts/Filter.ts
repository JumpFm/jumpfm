import { FilterBox as FilterApi } from 'jumpfm-api'
import { getKeys } from "./files";
import { shortway } from "./shortway";

export class Filter implements FilterApi {
    readonly input: HTMLInputElement = document.createElement('input')

    private readonly handlers: ((val: string) => void)[] = []


    constructor() {
        this.input.className = 'filter'
        this.input.addEventListener('keydown', e => e.stopPropagation(), false)
        this.input.addEventListener('input', () => {
            this.notifyAll()
        }, false)

        this.input.addEventListener('blur', this.hide, false)
        this.hide()
    }

    private notifyAll(): any {
        this.handlers.forEach(handler => {
            handler(this.input.value)
        });
    }

    set = (val: string) => {
        this.input.value = val
        this.notifyAll()
    }

    get = () => {
        return this.input.value
    }

    onChange = (handler: (val: string) => void) => this.handlers.push(handler)

    focus = () => {
        this.input.style.display = 'block'
        this.input.focus()
    }

    hide = () => this.input.style.display = 'none'

    bind = (actionName: string, defaultKeys: string[], action: () => void) => {
        getKeys(actionName, defaultKeys).forEach(combo => {
            const cb = shortway(combo, (e) => {
                e.preventDefault()
                action()
            })
            this.input.addEventListener('keydown', cb, false)
        })
    }
}
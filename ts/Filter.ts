import { Filter as FilterApi } from 'jumpfm-api'
import { getKeys } from "./files";

import * as keyboardjs from 'keyboardjs'

export class Filter implements FilterApi {
    readonly input: HTMLInputElement = document.createElement('input')

    private readonly handlers: ((val: string) => void)[] = []


    constructor() {
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

    clear = () => {
        this.input.value = ''
        // no notification
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
        keyboardjs.bind(getKeys(actionName, defaultKeys), (e) => {
            if (this.input.style.display === 'none') return
            e.preventDefault()
            action()
        })
    }

}
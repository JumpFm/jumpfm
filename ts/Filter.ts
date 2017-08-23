import { Filter as FilterApi } from 'jumpfm-api'

export class Filter implements FilterApi {
    bind(name: string, keys: string[], action: () => void) {
        throw new Error("Method not implemented.");
    }

    private readonly handlers: ((val: string) => void)[] = []
    readonly input: HTMLInputElement = document.createElement('input')


    constructor() {
        this.hide()
        this.input.addEventListener('keyup', () => {
            this.notifyAll()
        }, false)
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
    focus = () => this.input.style.display = 'block'
    hide = () => this.input.style.display = 'none'
}
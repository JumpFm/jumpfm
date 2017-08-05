import * as Mousetrap from 'mousetrap'

export class Dialog {
    dialog = () => document.getElementById('dialog') as HTMLDivElement
    title = () => document.getElementById('dialogTitle') as HTMLHeadingElement
    input = () => document.getElementById('dialogInput') as HTMLInputElement
    ok = (input: string) => { }

    open = (
        spec: {
            title: string,
            init: (input: HTMLInputElement) => void,
            ok: (input: string) => void
        }) => {
        this.ok = spec.ok
        this.dialog().style.display = 'block';
        this.title().innerText = spec.title + ":";
        this.input().select();
        spec.init && spec.init(this.input());
    }

    close = () => {
        this.dialog().style.display = 'none';
    }

    init = () => {
        const mousetrap = new Mousetrap(this.input());

        this.input().addEventListener('blur', this.close, false);

        mousetrap.bind('esc', this.close);
        mousetrap.bind('enter', () => {
            this.close();
            this.ok(this.input().value);
            return false
        });
    }
}
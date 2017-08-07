export class ProgressBar {
    complete: HTMLDivElement

    init = () => {
        this.complete =
            document.getElementById('progress-bar-complete') as HTMLDivElement
    }

    set = (prog: number) => {
        console.log('set', prog)
        this.complete.style.width = prog + '%'
    }

    clear = () => this.set(0)
}
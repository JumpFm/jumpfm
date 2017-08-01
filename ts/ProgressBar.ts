export class ProgressBar {
    model = {
        per: 0
    }

    set = (prog: number) => {
        this.model.per = prog
    }

    clear = () => this.model.per = 0
}
export class History {
    HISTORY_MAX_SIZE = 20;
    history = [];
    i = 0;

    push = (fullPath: string) => {
        this.history.splice(0, this.i);
        this.i = 0;
        this.history.unshift(fullPath);
        this.history.splice(this.HISTORY_MAX_SIZE);
        return fullPath;
    }

    forward = () => {
        this.i = Math.max(0, this.i - 1);
        return this.history[this.i];
    }

    back = () => {
        this.i = Math.min(this.i + 1, this.history.length - 1);
        return this.history[this.i];
    }

    pwd = () => {
        return this.history[this.i];
    }
}
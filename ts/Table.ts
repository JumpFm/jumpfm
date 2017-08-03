export class Table {
    tbody: HTMLElement

    constructor(id) {
        this.tbody = document.getElementById(id)
    }

    private clientHeight = () => this.tbody.clientHeight
    private rowHeight = () => this.tbody.scrollHeight / this.tbody.childNodes.length
    private rowTop = (i) => i * this.rowHeight()
    private rowBottom = (i) => (i + 1) * this.rowHeight()
    private bodyTop = () => this.tbody.scrollTop
    private bodyBottom = () => this.tbody.scrollTop + this.tbody.clientHeight

    getRowCountInPage = (): number => {
        return Math.floor(this.clientHeight() / this.rowHeight())
    }

    scroll = (rowNum) => {
        const rowTop = this.rowTop(rowNum)
        const rowBottom = this.rowBottom(rowNum)

        if (rowTop < this.bodyTop())
            this.tbody.scrollTop = rowTop
        if (rowBottom > this.bodyBottom())
            this.tbody.scrollTop = rowBottom - this.clientHeight()
    }
}



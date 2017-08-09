export class PanelView {
    readonly i
    tbody: HTMLElement
    filter: HTMLInputElement

    constructor(i) {
        this.i = i
    }

    private clientHeight = () => this.tbody.clientHeight
    private rowHeight = () => this.tbody.scrollHeight / this.tbody.childNodes.length
    private rowTop = (i) => i * this.rowHeight()
    private rowBottom = (i) => (i + 1) * this.rowHeight()
    private bodyTop = () => this.tbody.scrollTop
    private bodyBottom = () => this.tbody.scrollTop + this.clientHeight()

    getRowCountInPage = (): number => {
        return Math.floor(this.clientHeight() / this.rowHeight())
    }

    onLoad = () => {
        const i = this.i
        this.tbody = document.getElementById('tbody' + i)
        this.filter = document.getElementById('filter' + i) as HTMLInputElement
        this.filter.addEventListener('blur', this.hideFilter, false)
    }

    showFilter = () => {
        this.filter.style.display = 'block'
        this.filter.select()
    }

    hideFilter = () => {
        this.filter.style.display = 'none'
    }

    scroll = (rowNum: number) => {
        const rowTop = this.rowTop(rowNum)
        const rowBottom = this.rowBottom(rowNum)

        if (rowTop < this.bodyTop())
            this.tbody.scrollTop = Math.ceil(rowTop)
        if (rowBottom > this.bodyBottom())
            this.tbody.scrollTop = rowBottom - this.clientHeight()
    }
}



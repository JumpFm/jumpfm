import { ApiItem } from './ApiItem'

import * as Mousetrap from 'mousetrap'

export class ViewPanel {
    readonly panel: HTMLDivElement = document.createElement('div')
    private readonly table: HTMLTableElement = document.createElement('table')
    private readonly tbody: HTMLTableSectionElement = document.createElement('tbody')
    readonly filter: HTMLInputElement = document.createElement('input')
    readonly filterTrap = new Mousetrap(this.filter)

    constructor() {
        this.panel.className = 'panel'
        this.panel.appendChild(this.table)
        this.table.appendChild(this.tbody)
        // this.filter.addEventListener('blur', this.hideFilter, false)
    }

    private clientHeight = () => this.tbody.clientHeight
    private rowHeight = () => this.tbody.scrollHeight / this.tbody.childNodes.length
    private rowTop = (i) => i * this.rowHeight()
    private rowBottom = (i) => (i + 1) * this.rowHeight()
    private bodyTop = () => this.tbody.scrollTop
    private bodyBottom = () => this.tbody.scrollTop + this.clientHeight()

    getRowCountInPage = (): number =>
        Math.floor(this.clientHeight() / this.rowHeight())

    showFilter = () => {
        this.filter.style.display = 'block'
        this.filter.select()
    }

    hideFilter = () => this.filter.style.display = 'none'

    scroll = (rowNum: number) => {
        const rowTop = this.rowTop(rowNum)
        const rowBottom = this.rowBottom(rowNum)

        if (rowTop < this.bodyTop())
            this.tbody.scrollTop = Math.ceil(rowTop)
        if (rowBottom > this.bodyBottom())
            this.tbody.scrollTop = rowBottom - this.clientHeight()
    }

    clearItems = () => {
        while (this.tbody.lastChild) this.tbody.removeChild(this.tbody.lastChild)
    }

    addItems = (items: ApiItem[]) => {
        items.forEach(item => this.tbody.appendChild(item.view.tr))
    }
}



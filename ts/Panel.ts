import { Panel as PanelApi, Url, PanelListener, File } from 'jumpfm-api'

import { Item } from './Item'
import { Filter } from './Filter'

export class Panel implements PanelApi {
    private readonly handlers: PanelListener[] = []
    private readonly table: HTMLTableElement = document.createElement('table')
    private readonly tbody: HTMLTableSectionElement = document.createElement('tbody')
    private readonly thead: HTMLTableSectionElement = document.createElement('thead')
    private readonly title: HTMLTitleElement = document.createElement('title')
    private readonly trHead: HTMLTableRowElement = document.createElement('tr')

    private cur: number = 0
    private items: Item[]
    private url: Url

    readonly divPanel: HTMLDivElement = document.createElement('div')
    readonly filter: Filter = new Filter()

    constructor() {
        ['', 'Name', 'Size', 'Time'].forEach(head => {
            const td = document.createElement('td')
            td.textContent = head
            this.trHead.appendChild(td)
        })

        this.divPanel.className = 'panel'
        this.divPanel.appendChild(this.title)
        this.divPanel.appendChild(this.table)
        this.thead.appendChild(this.trHead)
        this.table.appendChild(this.thead)
        this.table.appendChild(this.tbody)
        this.filter.onChange(this.setTitle)
    }

    private clearItems = () => {
        while (this.tbody.lastChild) this.tbody.removeChild(this.tbody.lastChild)
    }

    private addItems = (items: Item[]) => {
        items.forEach(item => this.tbody.appendChild(item.tr))
    }

    private findNearestVisibleAbove = () => {
        for (let i = this.cur; i >= 0; i--)
            if (this.items[i].isVisible()) return i
        return -1
    }

    private findNearestVisibleBelow = () => {
        for (let i = this.cur; i < this.items.length; i++)
            if (this.items[i].isVisible()) return i
        return -1
    }

    deselectAll(): void {
        this.items.forEach(item => item.deselect())
    }

    getCurItem(): Item {
        return this.items[this.cur]
    }

    getSelectedItems(): Item[] {
        return this.items.filter((item, i) => i === this.cur || item.isSelected())
    }

    selectAll(): void {
        this.items.forEach(item => item.select())
    }

    toggleCurSel(): void {
        this.items[this.cur].toggleSelection()
    }

    getItems(): Item[] {
        return this.items
    }

    getUrl = (): Url => {
        return this.url
    }

    getPath = (): string => {
        return this.url.path
    }

    setItems(items: File[]) {
        this.items = items.map(item => new Item(item))
        const addItemsAndHandle = (i) => {
            if (i > this.items.length) {
                this.handlers
                    .filter(handler => handler.onPanelItemsSet)
                    .forEach(handler =>
                        setImmediate(() =>
                            handler.onPanelItemsSet()
                        )
                    )
                return
            }
            const j = i + 100
            console.log(`adding ${i} - ${j}`)
            this.addItems(this.items.slice(i, j))
            setImmediate(() => {
                addItemsAndHandle(j)
            })
        }

        this.clearItems()
        addItemsAndHandle(0)
        this.setCur(0)
        return this
    }

    step = (d: number, select = false) => {
        this.setCur(this.cur + d)
        this.scrollToCur()
    }

    scrollToCur = () => {
        const tr = this.items[this.cur].tr
        const trRect = tr.getBoundingClientRect()
        const tbodyRect = this.tbody.getBoundingClientRect()
        if (trRect.bottom > tbodyRect.bottom)
            tr.scrollIntoView(false)
        if (trRect.top < tbodyRect.top)
            tr.scrollIntoView(true)
    }

    private setCur = (i) => {
        const cur = this.items[this.cur]
        if (cur) cur.rmCur()

        const newCur = Math.max(0, Math.min(i, this.items.length - 1))
        this.items[this.cur = newCur].setCur()
    }


    listen(handler: PanelListener) {
        this.handlers.push(handler)
        return this
    }

    cd(path: string)
    cd(url: Url)
    cd(pathOrUrl): void {
        if (typeof pathOrUrl == 'string') return this.cd({
            protocol: '',
            path: pathOrUrl,
            query: {}
        })

        const url = pathOrUrl as Url
        this.url = url

        setImmediate(() => {
            this.handlers
                .filter(handler => handler.onPanelCd)
                .forEach(handler => handler.onPanelCd(url))
            this.setTitle()
        })
    }

    private setTitle = () => {
        const filter = this.filter.get()
        const protocol = this.url.protocol
        this.title.textContent =
            (protocol ? protocol + ':' : '')
            + this.url.path
            + (filter ? ' [' + filter + ']' : '')
    }
}
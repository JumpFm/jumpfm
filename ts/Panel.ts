import { Panel as PanelApi, Url, File } from 'jumpfm-api'

import { Item } from './Item'
import { Filter } from './Filter'

export class Panel implements PanelApi {
    private readonly table: HTMLTableElement = document.createElement('table')
    private readonly tbody: HTMLTableSectionElement = document.createElement('tbody')
    private readonly thead: HTMLTableSectionElement = document.createElement('thead')
    private readonly title: HTMLTitleElement = document.createElement('title')
    private readonly trHead: HTMLTableRowElement = document.createElement('tr')

    readonly divPanel: HTMLDivElement = document.createElement('div')
    readonly filterBox: Filter = new Filter()

    private readonly filters: { [name: string]: ((item: Item) => boolean) } = {}
    private readonly onCds: (() => void)[] = []
    private readonly onItemsAddeds: ((newItems: Item[]) => void)[] = []

    private url: Url
    private cur: number = 0
    private items: Item[] = []
    private visibleItems: Item[] = []

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
        this.filterBox.onChange(this.setTitle)
    }

    private clearItems = () => {
        while (this.tbody.lastChild) this.tbody.removeChild(this.tbody.lastChild)
    }

    private addItems = (items: Item[]) => {
        items.forEach(item => this.tbody.appendChild(item.tr))
    }

    private setTitle = () => {
        const filter = this.filterBox.get()
        const protocol = this.url.protocol
        this.title.textContent =
            (protocol ? protocol + ':' : '')
            + this.url.path
            + (filter ? ' [' + filter + ']' : '')
    }

    private scrollToCur = () => {
        const tr = this.visibleItems[this.cur].tr
        const trRect = tr.getBoundingClientRect()
        const tbodyRect = this.tbody.getBoundingClientRect()
        if (trRect.bottom > tbodyRect.bottom)
            tr.scrollIntoView(false)
        if (trRect.top < tbodyRect.top)
            tr.scrollIntoView(true)
    }

    private safeSetCurrent = (b: boolean) => {
        const item = this.visibleItems[this.cur]
        if (item) item.setCur(b)
    }

    private setCur = (i) => {
        this.safeSetCurrent(false)
        this.cur = Math.max(0, Math.min(i, this.visibleItems.length - 1))
        this.safeSetCurrent(true)
    }

    private progressiveProcessItems = (process: (items: Item[]) => void) =>
        (from: number, done?: () => void) => {

            if (from > this.items.length) return done && done()
            const to = from + 100

            process(this.items.slice(from, to))

            setImmediate(() => {
                this.progressiveProcessItems(process)(to, done)
            })
        }

    private progressiveAddItems = this.progressiveProcessItems(items => {
        this.addItems(items)

        this.onItemsAddeds.forEach(f =>
            setImmediate(() => f(items))
        )
    })

    private progressiveUpdateVisibility = this.progressiveProcessItems(items => {
        items.forEach(item => {
            const visible =
                Object.values(this.filters)
                    .every(filter => filter(item))

            if (visible) {
                this.visibleItems.push(item)
                item.show()
            } else {
                item.hide()
            }
        })
    })


    private updateVisibility = () => {
        const oldCur = this.visibleItems[this.cur]
        this.visibleItems = []
        this.progressiveUpdateVisibility(0, () => {
            if (oldCur) oldCur.setCur(false)
            this.setCur(this.cur)
        })
    }

    setActive = (b: boolean) => {
        if (b)
            this.divPanel.setAttribute('active', '')
        else
            this.divPanel.removeAttribute('active')
    }

    cd(path: string): void;
    cd(url: Url): void;
    cd(pathOrUrl: any) {
        if (typeof pathOrUrl == 'string') return this.cd({
            protocol: '',
            path: pathOrUrl,
            query: {}
        })

        this.url = pathOrUrl as Url
        this.setTitle()
        this.onCds.forEach(f => setImmediate(f))
    }

    onCd = (then: () => void) =>
        this.onCds.push(then)

    onItemsAdded = (then: (newItems: Item[]) => void) =>
        this.onItemsAddeds.push(then)

    step = (d: number, select?: boolean) => {
        this.setCur(this.cur + d)
        this.scrollToCur()
    }

    stepPgUp = (select?: boolean) => {
        throw new Error("Method not implemented.")
    }

    stepPgDown = (select?: boolean) => {
        throw new Error("Method not implemented.")
    }

    stepStart = (select?: boolean) => {
        throw new Error("Method not implemented.")
    }

    stepEnd = (select?: boolean) => {
        throw new Error("Method not implemented.")
    }

    selectNone = () =>
        this.items.forEach(item => item.setSelected(false))

    selectAll = () =>
        this.items.forEach(item => item.setSelected(true))

    selectToggleCurrent = () => {
        throw new Error("Method not implemented.")
    }

    getUrl = () =>
        this.url

    getItems = () =>
        this.items

    getSelectedItems = () =>
        this.visibleItems.filter((item, i) =>
            i === this.cur || item.isSelected()
        )

    getCurrentItem = () =>
        this.visibleItems[this.cur]

    setItems = (items: File[]) => {
        this.items = items.map(item => new Item(item))

        this.clearItems()
        this.progressiveAddItems(0)
        this.updateVisibility()
        this.setCur(0)
        return this
    }

    filterSet = (name: string, filter: (item: Item) => boolean) => {
        this.filters[name] = filter
        this.updateVisibility()
    }

    filterRemove = (name: string) => {
        delete this.filters[name]
        this.updateVisibility()
    }

    bind(name: string, keys: string[], action: () => void) {
        throw new Error("Method not implemented.");
    }
}
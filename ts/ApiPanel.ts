import {
    Panel as PanelApi
    , Url
    , PanelListener
    , Item
    , File
} from 'jumpfm-api'

import { ApiItem } from './ApiItem'

import { ViewPanel } from './ViewPanel'

export class Panel implements PanelApi {
    filterHide(): void {
        throw new Error("Method not implemented.");
    }
    filterShow(): void {
        throw new Error("Method not implemented.");
    }
    private readonly handlers: PanelListener[] = []
    private readonly view: ViewPanel = new ViewPanel()

    private url: Url
    private items: ApiItem[]
    private cur: number = 0


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

    filter(substr: string): void {
        throw new Error("Method not implemented.");
    }

    getCur(): number {
        throw new Error("Method not implemented.");
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

    step(d: number, select?: boolean) {
        throw new Error("Method not implemented.");
    }

    toggleCurSel(): void {
        this.items[this.cur].toggleSelection()
    }

    getItems(): Item[] {
        return this.items
    }

    // getItemsFilter = (): Item[] => {
    //     return this.model.items
    //         .filter(item =>
    //             item.name
    //                 .toLowerCase()
    //                 .indexOf(this.model.filter.toLowerCase()) > -1)
    // }

    // getCur = (): number => {
    //     return Math.min(
    //         this.getItemsFilter().length - 1,
    //         Math.max(0, this.model.cur)
    //     )
    // }

    // getCurItem = (): Item => {
    //     return this.getItemsFilter()[this.getCur()]
    // }


    // clearFilter = () => {
    //     this.model.filter = ''
    // }

    // private selectRange = (a, b) => {
    //     try {
    //         if (a > b) return this.selectRange(b, a)
    //         const files = this.getItemsFilter()
    //         for (var i = a; i <= b; i++) files[i].sel = true
    //     } catch (e) {
    //         console.log(e, a, b)
    //     }
    // }

    // step = (d: number, select = false) => {
    //     const i1 = this.getCur()
    //     this.model.cur = this.getCur() + Math.floor(d)

    //     if (select) this.selectRange(i1, this.getCur())
    //     return this
    // }

    // toggleSel = (): void => {
    //     const f = this.getCurItem()
    //     f.sel = !f.sel
    // }

    // selectAll = (): void => {
    //     this.getItemsFilter().forEach(item => item.sel = true)
    // }

    // deselectAll = (): void => {
    //     this.getItemsFilter().forEach(item => item.sel = false)
    // }

    getUrl = (): Url => {
        return this.url
    }

    getPath = (): string => {
        return this.url.path
    }

    // getSelectedItems = (): Item[] => {
    //     return this.getItemsFilter().filter((item, i) => {
    //         return item.sel || this.getCur() == i
    //     })
    // }

    // getSelectedItemsPaths = () => {
    //     return this.getSelectedItems().map(item => item.path)
    // }

    setItems(items: File[]) {
        this.items = items.map(item => new ApiItem(item))
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
            this.view.addItems(this.items.slice(i, j))
            setImmediate(() => {
                addItemsAndHandle(j)
            })
        }

        this.view.clearItems()
        addItemsAndHandle(0)
        return this
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
        this.handlers
            .filter(handler => handler.onPanelCd)
            .forEach(handler => handler.onPanelCd(url))
    }

    // getTitle = () => {
    //     const filter = this.model.filter
    //     const protocol = this.model.url.protocol
    //     return (
    //         protocol ?
    //             protocol + ':' :
    //             ''
    //     )
    //         + this.model.url.path
    //         + (filter ? ' [' + filter + ']' : '')
    // }

    // filter = (substr: string) => {
    //     this.model.filter = substr
    // }
}
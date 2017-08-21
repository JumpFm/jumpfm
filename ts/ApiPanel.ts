import {
    Panel as PanelApi
    , Url
    , PanelListener
    , ItemGet
    , ItemSet
} from 'jumpfm-api'

import { ApiItem } from './ApiItem'

import { ViewPanel } from './ViewPanel'
// import { itemFromPath } from './itemFromPath'

export class Panel implements PanelApi {
    readonly view: ViewPanel = new ViewPanel()
    private url: Url

    getItems(): ItemGet[] {
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

    items: ApiItem[]
    setItems(items: ItemSet[]) {
        this.items = items.map(item => new ApiItem(item))
        this.view.setItems(this.items.map(item => item.view))
        setTimeout(() => {
            this.handlers
                .filter(handler => handler.onPanelItemsSet)
                .forEach(handler => handler.onPanelItemsSet())
        }, 10)
        return this
    }


    readonly handlers: PanelListener[] = []

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
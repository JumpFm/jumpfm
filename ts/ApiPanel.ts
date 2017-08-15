import {
    Panel as PanelApi
    , Url
    , PanelListener
    , Item
} from 'jumpfm-api'

import { PanelView } from './ApiPanelView'
import { itemFromPath } from './itemFromPath'

export class Panel implements PanelApi {
    view: PanelView
    readonly itemFromPath = itemFromPath

    getCur = (): number => {
        return Math.min(
            this.getItems().length - 1,
            Math.max(0, this.model.cur)
        )
    }

    getCurItem = (): Item => {
        return this.getItems()[this.getCur()]
    }

    getItems = (): Item[] => {
        return this.model.items
            .filter(item =>
                item.name
                    .toLowerCase()
                    .indexOf(this.model.filter.toLowerCase()) > -1)
    }

    clearFilter = () => {
        this.model.filter = ''
    }

    private selectRange = (a, b) => {
        try {
            if (a > b) return this.selectRange(b, a)
            const files = this.getItems()
            for (var i = a; i <= b; i++) files[i].sel = true
        } catch (e) {
            console.log(e, a, b)
        }
    }

    step = (d: number, select = false) => {
        const i1 = this.getCur()
        this.model.cur = this.getCur() + Math.floor(d)

        if (select) this.selectRange(i1, this.getCur())
        return this
    }

    toggleSel = (): void => {
        const f = this.getCurItem()
        f.sel = !f.sel
    }

    selectAll = (): void => {
        this.getItems().forEach(item => item.sel = true)
    }

    deselectAll = (): void => {
        this.getItems().forEach(item => item.sel = false)
    }

    getUrl = (): Url => {
        return this.model.url
    }

    getPath = (): string => {
        return this.model.url.path
    }

    getSelectedItems = (): Item[] => {
        return this.getItems().filter((item, i) => {
            return item.sel || this.getCur() == i
        })
    }

    getSelectedItemsPaths = () => {
        return this.getSelectedItems().map(item => item.path)
    }

    setItems(items: Item[]) {
        this.model.items = items
        this.handlers
            .filter(handler => handler.onPanelItemsSet)
            .forEach(handler => handler.onPanelItemsSet())
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
        this.model.url = url
        this.handlers
            .filter(handler => handler.onPanelCd)
            .forEach(handler => handler.onPanelCd(url))
    }

    getTitle = () => {
        const filter = this.model.filter
        const protocol = this.model.url.protocol
        return (
            protocol ?
                protocol + ':' :
                ''
        )
            + this.model.url.path
            + (filter ? ' [' + filter + ']' : '')
    }

    model = {
        url: {
            protocol: '',
            path: '',
            query: {}
        },
        filter: '',
        cur: 0,
        items: [],

        getTitle: this.getTitle,
        getCur: this.getCur,
        getItems: this.getItems,
    }
}
import { Item } from './Item'
import { PanelView } from './PanelView'

export interface Url {
    protocol?: string
    path: string
    query?: { [key: string]: any }
}

type UrlHandler = (url: Url) => void

export class Panel {
    view: PanelView

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

    getPath = (): string => {
        return this.model.path
    }

    getSelectedItems = (): Item[] => {
        return this.getItems().filter((item, i) => {
            return item.sel || this.getCur() == i
        })
    }

    getSelectedItemsUrls = () => {
        return this.getSelectedItems().map(item => item.path)
    }

    setItems(files: Item[]) {
        this.model.items = files
        return this
    }


    readonly handlers: UrlHandler[] = []

    onCd(handler: UrlHandler) {
        this.handlers.push(handler)
        return this
    }

    cd(path: string)
    cd(url: Url)
    cd(x): void {
        if (typeof x == 'string') return this.cd({ path: x })
        const url = x as Url
        this.handlers.forEach(handler => handler(url))
        this.model.path = url.path
    }

    getTitle = () => {
        const filter = this.model.filter
        return this.model.path + (filter ? '[' + filter + ']' : '')
    }

    model = {
        path: '',
        filter: '',
        cur: 0,
        items: [],

        getTitle: this.getTitle,
        getCur: this.getCur,
        getItems: this.getItems,
    }
}
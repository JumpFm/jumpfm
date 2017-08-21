import { ViewItem } from './ViewItem'
import { ItemGet, ItemSet } from 'jumpfm-api'

export class ApiItem implements ItemGet {
    readonly view: ViewItem
    readonly path: string;
    readonly name: string;

    setIcon(icon: string): ItemGet {
        throw new Error("Method not implemented.");
    }

    setSize(size: number): ItemGet {
        this.view.setSize(size)
        return this
    }

    setTime(time: number): ItemGet {
        this.view.setTime(time)
        return this
    }

    constructor(item: ItemSet) {
        this.view = new ViewItem(item)
        this.path = item.path
        this.name = item.name
    }
}
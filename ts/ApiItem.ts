import { ViewItem } from './ViewItem'
import { Item, File } from 'jumpfm-api'

export class ApiItem implements Item {
    readonly view: ViewItem
    readonly path: string;
    readonly name: string;

    private hidden: boolean = false
    private selected: boolean = false

    hide = (): Item => {
        this.hidden = true
        this.view.hide()
        return this
    }

    show = (): Item => {
        this.hidden = false
        this.view.show()
        return this
    }

    isHidden = () =>
        this.hidden

    isVisible = () =>
        !this.hidden

    select = () => {
        this.selected = true
        this.view.select()
    }

    deselect = () => {
        this.selected = false
        this.view.deselect()
    }

    toggleSelection = () => {
        this.selected = !this.selected
    }

    isSelected = () => this.selected

    setIcon = (icon: string): Item => {
        throw new Error("Method not implemented.");
    }

    setSize = (size: number): Item => {
        this.view.setSize(size)
        return this
    }

    setTime = (time: number): Item => {
        this.view.setTime(time)
        return this
    }


    constructor(item: File) {
        this.view = new ViewItem(item)
        this.path = item.path
        this.name = item.name
    }
}
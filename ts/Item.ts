import { Item as ItemApi, File } from 'jumpfm-api'

import * as moment from 'moment'
import * as fileSize from 'filesize'

type attr = 'cur' | 'hidden' | 'selected'

export class Item implements ItemApi {

    private hidden: boolean = false
    private selected: boolean = false

    private readonly tdIcon = document.createElement('td')
    private readonly tdName = document.createElement('td')
    private readonly tdSize = document.createElement('td')
    private readonly tdTime = document.createElement('td')

    readonly tr = document.createElement('tr')

    constructor(item: File) {
        this.tr.appendChild(this.tdIcon)
        this.tr.appendChild(this.tdName)
        this.tr.appendChild(this.tdSize)
        this.tr.appendChild(this.tdTime)

        this.path = item.path
        this.name = item.name

        this.tdName.textContent =
            item.name || '--'
    }

    readonly path: string;
    readonly name: string;

    private set = (attr: attr) => {
        this.tr.setAttribute(attr, '')
        return this
    }

    private rm = (attr: attr) => {
        this.tr.removeAttribute(attr)
        return this
    }

    setCur = () => {
        this.set('cur')
        return this
    }

    rmCur = () => {
        this.rm('cur')
        return this
    }

    setIcon = (icon: string): Item => {
        this.tdIcon.textContent = icon
        return this
    }

    setTime = (time: number) => {
        this.tdTime.textContent =
            (time && moment(time).format('DD/MM/YYYY hh:mm') || '--')
        return this
    }

    setSize = (size: number) => {
        this.tdSize.textContent =
            (size && fileSize(size) || '--')
        return this
    }

    hide = (): Item => {
        this.hidden = true
        return this.set('hidden')
    }

    show = (): Item => {
        this.hidden = false
        return this.rm('hidden')
    }

    isHidden = () =>
        this.hidden

    isVisible = () =>
        !this.hidden

    select = () => {
        this.selected = true
        return this.set('selected')
    }

    deselect = () => {
        this.selected = false
        this.rm('selected')
    }

    toggleSelection = () => {
        if (this.selected) return this.deselect()
        return this.select()
    }

    isSelected = () => this.selected
}
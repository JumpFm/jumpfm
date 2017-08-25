import { Item as ItemApi, File } from 'jumpfm-api'

import * as moment from 'moment'
import * as fileSize from 'filesize'

type attr = 'cur' | 'hidden' | 'selected'

export class Item implements ItemApi {
    private hidden: boolean = false
    private selected: boolean = false

    private readonly icon = document.createElement('img')

    private readonly tdIcon = document.createElement('td')
    private readonly tdName = document.createElement('td')
    private readonly tdSize = document.createElement('td')
    private readonly tdTime = document.createElement('td')

    readonly tr = document.createElement('tr')

    constructor(item: File) {
        this.icon.className = 'file-icon'
        this.tdIcon.appendChild(this.icon)

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

    private readonly attrs: { [attr: string]: boolean } = {}

    private set = (attr: attr) => (b: boolean) => {
        this.attrs[attr] = b
        if (b)
            this.tr.setAttribute(attr, '')
        else
            this.tr.removeAttribute(attr)
        return this
    }

    private is = (attr: attr) => this.attrs[attr]

    setCur: (b: boolean) => void = this.set('cur')
    setHidden: (b: boolean) => void = this.set('hidden')
    setSelected: (b: boolean) => void = this.set('selected')

    hide = () => this.setHidden(true)
    show = () => this.setHidden(false)

    isSelected = () => this.is('selected')

    setIcon = (src: string): Item => {
        this.icon.src = src
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
}
import { ItemSet } from 'jumpfm-api'

import * as moment from 'moment'
import * as fileSize from 'filesize'

export class ViewItem {
    readonly tr = document.createElement('tr')
    private readonly icon = document.createElement('td')
    private readonly name = document.createElement('td')
    private readonly size = document.createElement('td')
    private readonly time = document.createElement('td')

    constructor(item: ItemSet) {
        this.tr.appendChild(this.icon)
        this.tr.appendChild(this.name)
        this.tr.appendChild(this.size)
        this.tr.appendChild(this.time)

        this.name.textContent =
            item.name || '--'
    }

    setIcon = (icon: string) =>
        this.icon.textContent = icon

    setTime = (time: number) =>
        this.time.textContent = (time && moment(time).format('DD/MM/YYYY hh:mm') || '--')

    setSize = (size: number) =>
        this.size.textContent = (size && fileSize(size) || '--')

}
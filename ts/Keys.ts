import { JumpFm } from './JumpFm'
import { load, save } from './settings'

import * as mousetrap from 'mousetrap'

export class Keys {
    private readonly userKeys = {}
    private readonly filters: HTMLInputElement[] = []

    jumpFm: JumpFm

    constructor(jumpFm: JumpFm) {
        this.jumpFm = jumpFm
    }

    onLoad = () => {
        [0, 1].forEach(i => {
            const filter = document.getElementById('filter' + i) as HTMLInputElement
            this.filters[i] = filter
            filter.addEventListener('blur', () => filter.style.display = 'none', false)
        })

        this.bindKeysFilterMode('closeFilter', ['esc'], () =>
            this.filters.forEach(filter => filter.blur())
        )

        this.bindKeys('openFilter', ['f'], () => {
            const filter = this.filters[this.jumpFm.panels.model.active]
            filter.style.display = 'block'
            filter.select()
        })
    }

    private getKeys = (actionName: string, defaultKeys: string[]): string[] => {
        const keys = this.userKeys[actionName]
        if (keys && Array.isArray(keys)) return keys
        return defaultKeys
    }


    private bind = (actionName: string,
        defaultKeys: string[],
        action: () => void,
        trap: mousetrap = mousetrap) => {
        this.getKeys(actionName, defaultKeys).forEach(key =>
            trap.bind(key, () => {
                action()
                return false
            })
        )
    }

    bindKeysFilterMode = (actionName: string, defaultKeys: string[], action: () => void) =>
        this.filters.forEach(filter =>
            this.bind(actionName, defaultKeys, action, new mousetrap(filter))
        )

    bindKeys = (actionName: string, defaultKeys: string[], action: () => void) =>
        this.bind(actionName, defaultKeys, action)
}
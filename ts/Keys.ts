import { JumpFm } from './JumpFm'
import { load, save } from './settings'

import * as mousetrap from 'mousetrap'

export class Keys {
    private readonly userKeys = {}

    private jumpFm: JumpFm
    private filters: mousetrap[] = []

    constructor(jumpFm: JumpFm) {
        this.jumpFm = jumpFm
    }

    onLoad = () => {
        [0, 1].forEach(i =>
            this.filters[i] = new mousetrap(this.jumpFm.panels.getPanel(i).view.filter)
        )
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
            this.bind(actionName, defaultKeys, action, filter)
        )

    bindKeys = (actionName: string, defaultKeys: string[], action: () => void) =>
        this.bind(actionName, defaultKeys, action)
}
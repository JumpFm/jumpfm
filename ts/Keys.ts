import { load, save } from './settings'

import * as mousetrap from 'mousetrap'

export class Keys {
    private readonly userKeys = {}

    getKeys = (actionName: string, defaultKeys: string[]): string[] => {
        const keys = this.userKeys[actionName]
        if (keys && Array.isArray(keys)) return keys
        return defaultKeys
    }

    bind = (actionName: string, defaultKeys: string[], action: () => void) => {
        this.getKeys(actionName, defaultKeys).forEach(key =>
            mousetrap.bind(key, () => {
                action()
                return false
            })
        )
    }
}
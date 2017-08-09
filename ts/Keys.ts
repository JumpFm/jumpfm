import { load, save } from './settings'

import * as mousetrap from 'mousetrap'

export class Keys {
    readonly userKeys = {}

    onLoad() {

    }

    bind(name: string, defaultKey: string, action: () => void) {
        const key = this.userKeys[name] || defaultKey
        mousetrap.bind(key, () => {
            action()
            return false
        })
    }
}
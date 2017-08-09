import { Plugin } from './Plugin'
import { JumpFm } from './JumpFm'
import { Panel } from './Panel'
import { Item } from './Item'

import * as homedir from 'homedir'
import * as fs from 'fs'
import * as path from 'path'

class KeyNav extends Plugin {
    onLoad() {
        console.log('key nav')
    }
}

module.exports = KeyNav
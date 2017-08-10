import { Plugin } from './Plugin'

import * as moment from 'moment'

class PluginVersion extends Plugin {
    onLoad(): void {
        this.jumpFm.statusBar.info('version', require('../package.json').version)
    }
}

module.exports = PluginVersion

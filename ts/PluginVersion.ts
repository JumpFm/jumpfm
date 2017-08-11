import { Plugin } from './Plugin';

class PluginVersion extends Plugin {
    onLoad(): void {
        this.jumpFm.statusBar.info('version', require('../package.json').version)
    }
}

module.exports = PluginVersion

import { packageJson } from './files';
import { Plugin } from './Plugin';

class PluginVersion extends Plugin {
    onLoad(): void {
        this.jumpFm.statusBar.info('version', packageJson.version)
    }
}

module.exports = PluginVersion

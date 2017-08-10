import { Plugin } from './Plugin'

class PluginHistory extends Plugin {
    onLoad(): void {
        console.log('history')
    }
}

module.exports = PluginHistory
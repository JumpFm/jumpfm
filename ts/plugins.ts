import { loadAndSave } from './settings'

export interface PluginDesc {
    enabled: boolean
    js: string
}

export const plugins = (): PluginDesc[] => {
    const defaultPlugins: PluginDesc[] = [
        { enabled: true, js: './PluginJump' },
        { enabled: true, js: './PluginFileSystem' },
        { enabled: true, js: './PluginKeyNav' },
        { enabled: true, js: './PluginFileOperations' },
        { enabled: true, js: './PluginZip' },
        { enabled: true, js: './PluginClock' },
        { enabled: true, js: './PluginVersion' },
    ]
    return loadAndSave('plugins.json', defaultPlugins)
        .filter(plugin => plugin.enabled)
}
import { pluginsOld, savePlugins } from './files'

export interface PluginDesc {
    enabled: boolean
    js: string
    css?: string
}

export const loadPlugins = (): PluginDesc[] => {
    const defaultPlugins: { [name: string]: PluginDesc } = {
        'fileSystem': { enabled: true, js: './PluginFileSystem' },
        'keyNav': { enabled: true, js: './PluginKeyNav' },
        'fileOperations': { enabled: true, js: './PluginFileOperations' },
        'flatMode': { enabled: true, js: './PluginFlatMode' },
    }

    Object.keys(defaultPlugins).forEach(key => {
        if (pluginsOld[key]) return
        pluginsOld[key] = defaultPlugins[key]
    })

    savePlugins(pluginsOld)
    return Object.values(pluginsOld).filter(plugin => plugin.enabled)
}
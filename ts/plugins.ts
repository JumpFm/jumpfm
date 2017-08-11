import { plugins, savePlugins } from './files';

export interface PluginDesc {
    enabled: boolean
    js: string
    css?: string
}

export const loadPlugins = (): PluginDesc[] => {
    const defaultPlugins: { [name: string]: PluginDesc } = {
        'clock': { enabled: true, js: './PluginClock' },
        'version': { enabled: true, js: './PluginVersion' },
        'fileSystem': { enabled: true, js: './PluginFileSystem' },
        'keyNav': { enabled: true, js: './PluginKeyNav' },
        'fileOperations': { enabled: true, js: './PluginFileOperations' },
        'copy': { enabled: true, js: './PluginCopy' },
        'zip': { enabled: true, js: './PluginZip' },
        'jump': { enabled: true, js: './PluginJump' },
        'history': { enabled: true, js: './PluginHistory' },
        'flatMode': { enabled: true, js: './PluginFlatMode' },
        'gitStatus': { enabled: true, js: './PluginGitStatus', css: './css/gitstatus.css' },
        'publicGist': { enabled: true, js: './PluginPublicGist' },
    }

    Object.keys(defaultPlugins).forEach(key => {
        if (plugins[key]) return
        plugins[key] = defaultPlugins[key]
    })

    savePlugins(plugins)
    return Object.values(plugins)
}
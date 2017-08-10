import { loadAndSave } from './settings'

export interface PluginDesc {
    enabled: boolean
    js: string
    css?: string
}

export const plugins = (): PluginDesc[] => {
    const defaultPlugins: PluginDesc[] = [
        { enabled: true, js: './PluginClock' },
        { enabled: true, js: './PluginVersion' },
        { enabled: true, js: './PluginFileSystem' },
        { enabled: true, js: './PluginKeyNav' },
        { enabled: true, js: './PluginFileOperations' },
        { enabled: true, js: './PluginCopy' },
        { enabled: true, js: './PluginZip' },
        { enabled: true, js: './PluginJump' },
        { enabled: true, js: './PluginHistory' },
        // { enabled: true, js: './PluginFlatMode' },
        { enabled: true, js: './PluginGitStatus', css: '../css/gitstatus.css' },
    ]
    return loadAndSave('plugins.json', defaultPlugins)
        .filter(plugin => plugin.enabled)
}
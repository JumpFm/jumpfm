import { load } from './settings'

export interface PluginDesc {
    enabled: boolean
    js: string
}

export const plugins = (): PluginDesc[] => {
    const defaultPlugins: PluginDesc[] = [
        { enabled: true, js: './PluginJump' },
        { enabled: true, js: './PluginFileSystem' },
        { enabled: true, js: './KeyNav' },
    ]

    return load('plugins', defaultPlugins).filter(plugin => plugin.enabled)
}
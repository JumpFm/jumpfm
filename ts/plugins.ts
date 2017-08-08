import { load } from './settings'

export interface PluginDesc {
    enabled: boolean
    js: string
}

export const plugins = (): PluginDesc[] => {
    const defaultPlugins: PluginDesc[] = [{
        enabled: true,
        js: './Jump'
    }]

    return load('plugins', defaultPlugins).filter(plugin => plugin.enabled)
}
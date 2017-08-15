import { Settings as SettingsApi } from 'jumpfm-api'

import { settings, saveSettings } from './files'

type Type = 'string' | 'number'

export class Settings implements SettingsApi {
    private get = <T>(type: Type) => (key: string, defaultValue: T) => {
        const val = settings[key]
        if (val && (typeof val === type)) return val
        settings[key] = defaultValue
        saveSettings(settings)
        return defaultValue
    }

    getNum = this.get<number>('number')
    getStr = this.get<string>('string')
}
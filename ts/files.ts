import * as fs from 'fs-extra';
import * as homedir from 'homedir';
import * as path from 'path';

export interface Plugins {
    name: string
    version: string
    dependencies: { [name: string]: string }
}

const load = (path: string) => {
    try {
        return require(path)
    } catch (e) {
        console.log(e)
        return {}
    }
}

const save = <T>(path: string) => (obj: T) => {
    fs.writeFileSync(path, JSON.stringify(obj, null, 4))
    return obj;
}

export const packageJson = require('../package.json')

export const root = path.join(homedir(), ".jumpfm")
export const pluginsPath = path.join(root, 'plugins')
if (!fs.existsSync(pluginsPath))
    fs.mkdirpSync(pluginsPath)

export const pluginsPackageJson = path.join(pluginsPath, 'package.json')
export const settingsPath = path.join(root, 'settings.json')
export const keyboardPath = path.join(root, 'keyboard.json')

export const settings = load(settingsPath)
export const keyboard = load(keyboardPath)

export const saveSettings = save(settingsPath)
export const saveKeyboard = () => save(keyboardPath)(keyboard)
export const savePlugins = save<Plugins>(pluginsPackageJson)


export const getKeys = (actionName: string, defaultKeys: string[]): string[] => {
    const keys = keyboard[actionName]
    if (keys && Array.isArray(keys)) return keys
    keyboard[actionName] = defaultKeys
    return defaultKeys
}

import * as fs from 'fs-extra';
import * as homedir from 'homedir';
import * as path from 'path';

interface EditableFile {
    path: string
    title: string
    icon: string
}

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
export const pluginsRoot = path.join(root, 'plugins')
if (!fs.existsSync(pluginsRoot))
    fs.mkdirpSync(pluginsRoot)

export const pluginsPath = path.join(pluginsRoot, 'package.json')
const settingsPath = path.join(root, 'settings.json')
const keyboardPath = path.join(root, 'keyboard.json')

export const editableFiles: EditableFile[] = [
    {
        path: keyboardPath,
        title: 'Keyboard',
        icon: 'fa fa-key'
    },
    {
        path: pluginsPath,
        title: 'Plugins',
        icon: 'fa fa-plug'
    },
    {
        path: settingsPath,
        title: 'Settings',
        icon: 'fa fa-cog',
    },
]

export const settings = load(settingsPath)
export const keyboard = load(keyboardPath)

export const saveSettings = save(settingsPath)
export const saveKeyboard = save(keyboardPath)
export const savePlugins = save<Plugins>(pluginsPath)

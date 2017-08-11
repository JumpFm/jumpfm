import * as fs from 'fs-extra';
import * as homedir from 'homedir';
import * as path from 'path';

type name = 'settings.json' | 'keyboard.json' | 'plugins.json'

interface EditableFile {
    name: name
    title: string
    icon: string
}

export const packageJson = require('../package.json')

export const editableFiles: EditableFile[] = [
    {
        name: 'keyboard.json',
        title: 'Keyboard',
        icon: 'fa fa-keyboard-o'
    },
    {
        name: 'plugins.json',
        title: 'Plugins',
        icon: 'fa fa-plug'
    },
    {
        name: 'settings.json',
        title: 'Settings',
        icon: 'fa fa-cog',
    },
]

export const root = path.join(homedir(), ".jumpfm", packageJson.version)
const fullPath = (name: name) => path.join(root, name)
const load = (name: name) => {
    try {
        return require(fullPath(name))
    } catch (e) {
        console.log(e)
        return {}
    }
}

const save = (name: name) => (obj) => {
    fs.writeFileSync(fullPath(name), JSON.stringify(obj, null, 4))
}

export const saveSettings = save('settings.json')
export const saveKeyboard = save('keyboard.json')
export const savePlugins = save('plugins.json')

export var settings
export var keyboard
export var plugins

setImmediate(() => {
    if (!fs.existsSync(root)) fs.mkdirpSync(root)
    settings = load('settings.json')
    keyboard = load('keyboard.json')
    plugins = load('plugins.json')
})

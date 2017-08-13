import * as fs from 'fs-extra';
import * as homedir from 'homedir';
import * as path from 'path';

type name = 'settings.json' | 'keyboard.json' | 'plugins.json' | 'cmds.json'

interface EditableFile {
    name: name
    title: string
    icon: string
}

export const editableFiles: EditableFile[] = [
    {
        name: 'keyboard.json',
        title: 'Keyboard',
        icon: 'fa fa-key'
    },
    {
        name: 'cmds.json',
        title: 'External Commands',
        icon: 'fa fa-star',
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
export const saveCmds = save('cmds.json')


export const root = path.join(homedir(), ".jumpfm")
if (!fs.existsSync(root)) fs.mkdirpSync(root)

export const packageJson = require('../package.json')
export const settings = load('settings.json')
export const keyboard = load('keyboard.json')
export const plugins = load('plugins.json')
export const cmds = load('cmds.json')


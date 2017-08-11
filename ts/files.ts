import * as homedir from 'homedir'
import * as fs from 'fs'
import * as path from 'path'

type name = 'settings.json' | 'keyboard.json' | 'plugins.json'

interface EditableFile {
    name: name
    title: string
    icon: string
}

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

export const root = path.join(homedir(), ".jumpfm")

const load = (name: name) => {
    try {
        return require(path.join(root, name))
    } catch (e) {
        console.log(e)
        return {}
    }
}

export const save = (name: name, obj) => {
    const fullPath = path.join(root, name)
    fs.writeFileSync(fullPath, JSON.stringify(obj, null, 4))
}

export var settings
export var keyboard
export var plugins

setImmediate(() => {
    if (!fs.existsSync(root)) fs.mkdirSync(root)
    settings = load('settings.json')
    keyboard = load('keyboard.json')
    plugins = load('plugins.json')
})

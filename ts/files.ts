import * as homedir from 'homedir'
import * as fs from 'fs'
import * as path from 'path'

interface EditableFile {
    title: string
    name: string
    icon: string
}

export const root = path.join(homedir(), ".jumpfm");
export const editableFiles: EditableFile[] = [
    {
        title: 'Keyboard',
        name: 'keyboard.json',
        icon: 'fa fa-keyboard-o'
    },
    {
        title: 'Plugins',
        name: 'plugins.json',
        icon: 'fa fa-plug'
    },
    {
        title: 'Settings',
        name: 'settings.json',
        icon: 'fa fa-cog',
    },
]


export var settings

setImmediate(() => {
    if (!fs.existsSync(root)) fs.mkdirSync(root);
    settings = this.load('settings.json', {
        editor: 'gedit'
    })
})

export const save = (name: string, settings) => {
    const fullPath = path.join(root, name)
    fs.writeFileSync(fullPath, JSON.stringify(settings, null, 4))
}

export const load = <T>(name: string, defaults: T): T => {
    try {
        const fullPath = path.join(root, name)

        return fs.existsSync(fullPath) ?
            merge(defaults, require(fullPath)) :
            defaults

    } catch (e) {
        console.log(e.message);
        return defaults
    }
}

export const loadAndSave = <T>(name: string, defaults: T): T => {
    const settings = load(name, defaults)
    save(name, settings)
    return settings
}

const typeOf = (obj: any) => Array.isArray(obj) ? 'array' : typeof obj

const merge = <T>(defaults: T, obj: any): T => {
    if (typeOf(defaults) != typeOf(obj)) return defaults
    if (typeOf(defaults) === 'object') {
        Object.keys(defaults).forEach(key => {
            defaults[key] = obj.hasOwnProperty(key) ?
                merge(defaults[key], obj[key]) :
                defaults[key]
        })
    }
    if (typeOf(defaults) === 'array') {
        // TODO merge arrays
    }

    return defaults
}
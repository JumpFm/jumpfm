import * as homedir from 'homedir'
import * as fs from 'fs'
import * as path from 'path'

export const root = path.join(homedir(), ".jumpfm");

export var misc
setImmediate(() => {
    if (!fs.existsSync(root)) fs.mkdirSync(root);
    misc = this.load('misc.json', {
        editor: 'gedit'
    })
})

const merge = <T>(obj: any, defaults: T): T => {
    if (typeof (obj) !== 'object')
        return typeof (obj) === typeof (defaults) ? obj : defaults

    Object.keys(defaults).forEach(key => {
        obj[key] = obj.hasOwnProperty(key) ?
            merge(obj[key], defaults[key]) :
            defaults[key]
    })

    Object.keys(obj).forEach(key =>
        defaults.hasOwnProperty(key) || delete obj[key]
    )

    return obj
}

export const save = (name: string, settings) => {
    const fullPath = path.join(root, name)
    fs.writeFileSync(fullPath, JSON.stringify(settings, null, 4))
}

export const load = <T>(name: string, defaults: T): T => {
    try {
        const fullPath = path.join(root, name)

        return fs.existsSync(fullPath) ?
            merge(require(fullPath), defaults) :
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
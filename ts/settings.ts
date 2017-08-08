import * as homedir from 'homedir'
import * as fs from 'fs'
import * as path from 'path'

export const root = path.join(homedir(), ".jumpfm");

if (!fs.existsSync(root)) fs.mkdirSync(root);

const typeOf = obj => Array.isArray(obj) ? 'array' : typeof obj

export const merge = <T>(obj: any, defaults: T): T => {
    if (typeOf(obj) !== 'object')
        return typeOf(obj) === typeOf(defaults) ? obj : defaults

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
    fs.writeFileSync(name, JSON.stringify(settings, null, 4));
}

export const load = <T>(name: string, defaults: T): T => {
    const fullPath = path.join(root, name)

    return fs.existsSync(fullPath) ?
        merge(require(name), defaults) :
        defaults
}
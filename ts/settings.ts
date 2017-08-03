import * as homedir from 'homedir'
import * as fs from 'fs'
import * as path from 'path'

export const root = path.join(homedir(), ".jumpfm");

if (!fs.existsSync(root)) fs.mkdirSync(root);

function sync<T>(obj: any, defaults: T): T {
    console.log('sync',
        JSON.stringify(obj),
        JSON.stringify(defaults),
        typeof obj,
        typeof defaults
    )

    if (typeof obj !== 'object') return (typeof obj) === (typeof defaults) ? obj : defaults

    console.log('objects')

    Object.keys(defaults).forEach(key => {
        obj[key] = obj.hasOwnProperty(key) ?
            sync(obj[key], defaults[key]) :
            defaults[key]
    })

    Object.keys(obj).forEach(key => {
        if (!defaults.hasOwnProperty(key)) delete obj[key]
    })

    return obj
}

function load<T>(fullPath: string, defaults: T): T {
    try {
        const settings = fs.existsSync(fullPath) ?
            sync(require(fullPath), defaults) :
            defaults

        fs.writeFileSync(fullPath, JSON.stringify(settings, null, 2));

        return settings
    } catch (e) {
        console.log(e)
        fs.writeFileSync(fullPath, JSON.stringify(defaults, null, 2));
        return defaults
    }
}

export const miscFullPath = path.join(root, 'misc.json')

export const misc = load(miscFullPath, {
    editor: 'gedit',
    maxFilesInPanel: 1000
})
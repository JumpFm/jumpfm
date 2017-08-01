import * as fs from 'fs'
import * as path from 'path'

import { files } from './files'

export module settings {
    const defaultSettings = require('../settings.json');
    export const fullPath = path.join(files.root, 'settings.json');

    if (!fs.existsSync(fullPath))
        fs.writeFileSync(fullPath, JSON.stringify(defaultSettings, null, 2));

    const settings = require(fullPath);

    function get(key:string){
        return settings[key] || defaultSettings[key]
    }

    export const editor = get('editor')
    export const maxFiles = get('maxFiles')
    export const maxFlatModeSize = get('maxFlatModeSize')
}
import * as fs from 'fs'
import * as path from 'path'
import * as homedir from 'homedir'

export module files {
    export const root = path.join(homedir(), ".jumpfm");
    if (!fs.existsSync(root)) fs.mkdirSync(root);
}
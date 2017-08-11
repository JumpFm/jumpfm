import * as fs from 'fs';
import * as path from 'path';

import { getExtIcon } from './icons';

export interface Item {
    icon: string
    path: string
    name: string
    size: number
    mtime: number
    sel: boolean
    classes: string[]
}

export const itemFromPath = (fullPath): Item => {
    const stat = fs.statSync(fullPath)
    const ext = path.extname(fullPath).substr(1).toLowerCase()
    const icon = getExtIcon(ext) || (
        stat.isDirectory() ?
            'file-icons/default_folder.svg' :
            'file-icons/default_file.svg'
    )

    return {
        icon: icon,
        path: fullPath,
        name: path.basename(fullPath),
        size: stat.size,
        mtime: stat.mtime.getTime(),
        sel: false,
        classes: []
    }

}
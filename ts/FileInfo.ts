import * as fs from 'fs'
import * as path from 'path'
import * as request from 'request'

const icons = require('../icons.json')
const extensions = {}
for (var icon in icons) {
    icons[icon].forEach(ext => {
        extensions[ext] = icon
    });
}

export class FileInfo {
    icon: string
    stat: fs.Stats
    name: string
    fullPath: string
    sel = false

    constructor(fullPath: string, name: string = undefined) {
        this.stat = fs.statSync(fullPath)
        this.name = name ? name : path.basename(fullPath)
        this.fullPath = fullPath
        this.icon = this.getIcon(fullPath)
    }

    private getIcon = (fullPath: string) => {
        const ext = path.extname(fullPath).substr(1).toLowerCase()
        const icon = extensions[ext]
        if (icon) {
            return 'file-icons/file_type_' + icon + '.svg'
        }

        return this.stat.isDirectory() ?
            'file-icons/default_folder.svg' :
            'file-icons/default_file.svg'
    }
}
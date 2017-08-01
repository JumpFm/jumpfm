import { JumpFm } from './JumpFm'

import * as mousetrap from 'mousetrap'
import * as unzip from 'unzip'
import * as replaceExt from 'replace-ext'
import * as fs from 'fs'
import * as path from 'path'
import * as archiver from 'archiver'

export function bindZip(jumpFm: JumpFm) {

    console.log('bindZip')

    mousetrap.bind('u', () => {
        console.log('bindZip')
        const pan = jumpFm.panels.getActivePanel()
        const zipFile = pan.getCurFile()

        if (path.extname(zipFile.name) !== '.zip') {
            jumpFm.statusBar.err('Error: ' + zipFile.name + ' is not a zip file')
            return
        }

        const fullPath = zipFile.fullPath
        fs.createReadStream(fullPath)
            .pipe(unzip.Extract({
                path: replaceExt(fullPath, '')
            }));
        return false
    })

    mousetrap.bind('z', () => {
        const zip = archiver('zip', { zlib: { level: 1 } })
        const pan = jumpFm.panels.getActivePanel()
        pan.getSelectedFiles().forEach(file => {
            console.log('adding', file.fullPath, file.name)
            if (file.stat.isDirectory()) zip.directory(file.fullPath, file.name)
            else zip.append(file.fullPath, { name: file.name })
        })
        jumpFm.dialog.open({
            title: 'Zip To',
            init: input => {
                input.value = 'untitled.zip'
                input.select()
                input.selectionStart = 0
                input.selectionEnd = 'untitled'.length
            },
            ok: to => {
                const out = fs.createWriteStream(path.join(pan.getCurDir(), to))
                zip.pipe(out)
                zip.finalize()
            }
        })
        return false
    })
}
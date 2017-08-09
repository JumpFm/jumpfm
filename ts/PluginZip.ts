import { Plugin } from './Plugin'

import * as fs from 'fs'
import * as path from 'path'
import * as extractor from 'unzip'
import * as archiver from 'archiver'
import * as replaceExt from 'replace-ext'

class PluginZip extends Plugin {
    onLoad(): void {
        const jumpFm = this.jumpFm
        const bind = jumpFm.bindKeys
        const activePanel = jumpFm.panels.getActivePanel

        const unzip = () => {
            try {
                const zipFile = activePanel().getCurItem()
                const fullPath = zipFile.url
                fs.createReadStream(fullPath)
                    .pipe(extractor.Extract({
                        path: replaceExt(fullPath, '')
                    }));
            } catch (e) {
                console.log(e)
            }
        }

        const zip = () => {
            const zip = archiver('zip', { zlib: { level: 1 } })
            const pan = activePanel()
            pan.getSelectedItems().forEach(item => {
                const stat = fs.statSync(item.url)
                if (stat.isDirectory())
                    zip.directory(item.url, item.name)
                else
                    zip.append(item.url, { name: item.name })
            })

            jumpFm.dialog.open({
                label: 'Zip To',
                onOpen: input => {
                    input.value = 'untitled.zip'
                    input.select()
                    input.setSelectionRange(0, 'untitled'.length)
                },
                onAccept: to => {
                    const out = fs.createWriteStream(path.join(pan.getUrl(), to))
                    zip.pipe(out)
                    zip.finalize()
                }
            })
        }

        bind('zip', ['z'], zip)
        bind('unzip', ['u'], unzip)
    }
}

module.exports = PluginZip
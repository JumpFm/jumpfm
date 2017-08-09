import { JumpFm } from './JumpFm'
import { Plugin } from './Plugin'

import * as fs from 'fs'
import * as path from 'path'

class PluginFileOperations extends Plugin {
    onLoad(): void {
        const jumpFm = this.jumpFm
        const dialog = jumpFm.dialog
        const bind = this.jumpFm.bindKeys
        const activePanel = () => jumpFm.panels.getActivePanel()

        bind('rename', ['f2'], () => {
            dialog.open({
                label: 'Rename',
                onOpen: input => {
                    input.value = activePanel().getCurItem().name
                    input.select()
                },
                onAccept: name => {
                    const pan = activePanel()
                    fs.renameSync(
                        pan.getCurItem().url,
                        path.join(pan.getUrl(), name)
                    )
                },
            })
        })

        bind('newFolder', ['f7'], () => {
            dialog.open({
                label: 'New Folder',
                onOpen: input => {
                    input.value = 'New Folder'
                    input.select()
                },
                onAccept: name => {
                    const pan = activePanel()
                    fs.mkdirSync(
                        path.join(pan.getUrl(), name)
                    )
                },
            })
        })
    }
}

module.exports = PluginFileOperations
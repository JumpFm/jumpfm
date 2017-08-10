import { JumpFm } from './JumpFm'
import { Plugin } from './Plugin'

import * as fs from 'fs'
import * as path from 'path'
import * as shell from 'shelljs'
import * as cmd from 'node-cmd'
import { misc } from './settings'
import { opn } from './opn'

class PluginFileOperations extends Plugin {
    onLoad(): void {
        const jumpFm = this.jumpFm
        const dialog = jumpFm.dialog
        const bind = this.jumpFm.bindKeys
        const activePanel = () => jumpFm.panels.getActivePanel()

        const del = () =>
            shell.rm('-rf', activePanel().getSelectedItemsUrls())

        const edit = () =>
            cmd.run(misc.editor + " " + activePanel().getCurItem().path)

        const newFile = () => {
            const pwd = activePanel().getPath()
            jumpFm.dialog.open({
                label: "New File",
                onOpen: input => {
                    input.value = "untitled.txt"
                    input.select();
                },
                onAccept: name => {
                    const f = path.join(pwd, name)
                    fs.closeSync(fs.openSync(f, 'a'))
                    opn(f);
                }
            })
        }

        const rename = () => {
            dialog.open({
                label: 'Rename',
                onOpen: input => {
                    const name = activePanel().getCurItem().name
                    input.value = name
                    input.select()
                    input.setSelectionRange(0, name.length - path.extname(name).length);
                },
                onAccept: name => {
                    const pan = activePanel()
                    fs.renameSync(
                        pan.getCurItem().path,
                        path.join(pan.getPath(), name)
                    )
                },
            })
        }

        const newFolder = () => {
            dialog.open({
                label: 'New Folder',
                onOpen: input => {
                    input.value = 'New Folder'
                    input.select()
                },
                onAccept: name => {
                    const pan = activePanel()
                    fs.mkdirSync(
                        path.join(pan.getPath(), name)
                    )
                },
            })
        }

        bind('del', ['del'], del)
        bind('edit', ['f4'], edit)
        bind('newFile', ['shift+f4'], newFile)
        bind('rename', ['f2'], rename)
        bind('newFolder', ['f7'], newFolder)
    }
}

module.exports = PluginFileOperations
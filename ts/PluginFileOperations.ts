import { JumpFm } from './JumpFm'
import { Plugin } from './Plugin'
import { misc } from './settings'
import { opn } from './opn'

import * as fs from 'fs'
import * as path from 'path'
import * as shell from 'shelljs'
import * as cmd from 'node-cmd'

const { clipboard } = require('electron')

class PluginFileOperations extends Plugin {
    onLoad(): void {
        const jumpFm = this.jumpFm
        const dialog = jumpFm.dialog
        const bind = this.jumpFm.bindKeys
        const activePanel = jumpFm.getActivePanel
        const passivePanel = jumpFm.getPassivePanel

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

        const mv = () => {
            activePanel().getSelectedItems().forEach(file =>
                shell.mv(
                    file.path,
                    path.join(passivePanel().getPath(), file.name)
                )
            )
        }

        bind('del', ['del'], del)
        bind('edit', ['f4'], edit)
        bind('newFile', ['shift+f4'], newFile)
        bind('rename', ['f2'], rename)
        bind('newFolder', ['f7'], newFolder)
        bind('mv', ['f6'], mv)
        bind('copyFullPath', ['p'], () => {
            const path = activePanel().getCurItem().path
            clipboard.writeText(path)
            jumpFm.statusBar.msg('clipboard', 'copied: ' + path, ['info'], 2000)
        })
    }
}

module.exports = PluginFileOperations
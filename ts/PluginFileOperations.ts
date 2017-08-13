import * as fs from 'fs-extra';
import * as cmd from 'node-cmd';
import * as path from 'path';

import { opn } from './opn';
import { Plugin } from './Plugin';

const { clipboard } = require('electron')

class PluginFileOperations extends Plugin {
    onLoad(): void {
        const jumpFm = this.jumpFm
        const dialog = jumpFm.dialog
        const bind = this.jumpFm.bindKeys
        const activePanel = jumpFm.getActivePanel
        const passivePanel = jumpFm.getPassivePanel

        const del = () =>
            activePanel().getSelectedItemsPaths().forEach(path => fs.remove(path))

        const edit = () =>
            cmd.run(
                jumpFm.settings.getStr('editor', 'gedit')
                + " "
                + activePanel().getCurItem().path
            )

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
                fs.move(
                    file.path,
                    path.join(passivePanel().getPath(), file.name)
                )
            )
        }

        bind('del', ['del'], del).filterMode([])
        bind('edit', ['f4'], edit).filterMode()
        bind('newFile', ['shift+f4'], newFile).filterMode()
        bind('rename', ['f2'], rename).filterMode()
        bind('newFolder', ['f7'], newFolder).filterMode()
        bind('mv', ['f6'], mv).filterMode()
        bind('copyFullPath', ['p'], () => {
            const path = activePanel().getCurItem().path
            clipboard.writeText(path)
            jumpFm.statusBar.info('clipboard', 'copied: ' + path, 3000)
        }).filterMode([])
    }
}

module.exports = PluginFileOperations
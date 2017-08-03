import { JumpFm } from './JumpFm'
import { Panels } from './Panels'
import { Panel } from './Panel'
import { Dialog } from './Dialog'
import { misc } from './settings'
import { opn } from './opn'

import * as cmd from 'node-cmd';
import * as shell from 'shelljs'

import * as mousetrap from 'mousetrap'

import * as path from 'path'
import * as fs from 'fs'

export function bindFileOperations(jumpFm: JumpFm) {
    function pan(): Panel {
        return jumpFm.panels.getActivePanel()
    }

    // DEL
    mousetrap.bind('del', () => {
        shell.rm('-rf', pan().getSelectedFilesFullPath())
        return false;
    });

    // EDIT
    mousetrap.bind('f4', () => {
        const cm = misc.editor + " " + pan().getCurFile().fullPath
        cmd.run(cm);
        return false;
    });

    // NEW FILE
    mousetrap.bind('shift+f4', () => {
        const pwd = pan().getCurDir();
        jumpFm.dialog.open({
            title: "New File",
            init: function (input): void {
                input.value = "untitled.txt";
                input.select();
            },
            ok: function (input): void {
                const f = path.join(pwd, input);
                fs.closeSync(fs.openSync(f, 'a'));
                opn(f);
            }
        });
        return false;
    });

    // NEW DIR
    mousetrap.bind('f7', () => {
        const pwd = pan().getCurDir();
        jumpFm.dialog.open({
            title: "New Folder",
            init: function (input) {
                input.value = "folder";
                input.select();
            },
            ok: function (input) {
                const d = path.join(pwd, input);
                shell.mkdir(d);
            }
        });
        return false;
    });

    // RENAME
    mousetrap.bind('f2', () => {
        const pwd = pan().getCurDir();
        const curFile = pan().getCurFile();
        const name = curFile.name;

        jumpFm.dialog.open({
            title: "Rename File",
            init: function (input) {
                input.value = curFile.name;
                input.setSelectionRange(0, name.length - path.extname(name).length);
            },
            ok: function (input) {
                fs.rename(
                    path.join(pwd, name),
                    path.join(pwd, input),
                    () => { }
                );
            }
        });

        return false;
    });
}
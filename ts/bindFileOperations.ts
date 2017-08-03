const clipboard = require('electron').clipboard;

import { JumpFm } from './JumpFm'
import { Panels } from './Panels'
import { Panel } from './Panel'
import { Dialog } from './Dialog'
import { misc } from './settings'
import { opn } from './opn'
import { keys } from './settings'

import * as cmd from 'node-cmd';
import * as shell from 'shelljs'

import * as mousetrap from 'mousetrap'

import * as path from 'path'
import * as fs from 'fs'

import * as extractor from 'unzip'
import * as archiver from 'archiver'
import * as replaceExt from 'replace-ext'

export function bindFileOperations(jumpFm: JumpFm) {
    const pan = () => jumpFm.panels.getActivePanel()

    const del = () => {
        shell.rm('-rf', pan().getSelectedFilesFullPath())
        return false;
    }

    const edit = () => {
        const cm = misc.editor + " " + pan().getCurFile().fullPath
        cmd.run(cm);
        return false;
    }

    const newFile = () => {
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
    }

    const newDir = () => {
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
    }

    const rename = () => {
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
    }

    const unzip = () => {
        const zipFile = pan().getCurFile()

        try {
            const fullPath = zipFile.fullPath
            fs.createReadStream(fullPath)
                .pipe(extractor.Extract({
                    path: replaceExt(fullPath, '')
                }));
            return false
        } catch (e) {
            jumpFm.statusBar.err('Error: ' + zipFile.name + ' is not a zip file')
            return false
        }
    }

    const zip = () => {
        const zip = archiver('zip', { zlib: { level: 1 } })
        const pan = jumpFm.panels.getActivePanel()
        pan.getSelectedFiles().forEach(file => {
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
    }

    const copyFullPath = () => {
        const fullPath = pan().getCurFile().fullPath
        jumpFm.statusBar.info('Clipboard: ' + fullPath)
        clipboard.writeText(fullPath);
    }

    const file = keys.file

    file.del.forEach(key => mousetrap.bind(key, del))
    file.edit.forEach(key => mousetrap.bind(key, edit))
    file.newFile.forEach(key => mousetrap.bind(key, newFile))
    file.newDir.forEach(key => mousetrap.bind(key, newDir))
    file.rename.forEach(key => mousetrap.bind(key, rename))
    file.zip.forEach(key => mousetrap.bind(key, zip))
    file.unzip.forEach(key => mousetrap.bind(key, unzip))
    file.copyFullPath.forEach(key => mousetrap.bind(key, ))
}
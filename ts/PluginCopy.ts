import { Plugin } from './Plugin'
import { JumpFm } from './JumpFm'

import * as fileSize from 'filesize'
import * as fs from 'fs'
import * as path from 'path'
import * as progress from 'progress-stream'

interface cp {
    fileFullPath: string
    dirFullPath: string
}

class PluginCopy extends Plugin {

    copying: boolean = false
    readonly q: cp[] = []

    private done = () => {
        this.jumpFm.statusBar.clear('q')
        this.jumpFm.statusBar.clear('cp')
    }

    private cpFileAndPop = () => {
        if (this.q.length == 0) return this.done()
        if (this.copying) return

        this.copying = true

        const cp = this.q[this.q.length - 1]

        const prog = progress({
            length: fs.statSync(cp.fileFullPath).size,
            time: 200
        }, (prog) => {
            this.jumpFm.statusBar.msg('cp',
                'cp: '
                + path.basename(cp.fileFullPath)
                + ' '
                + prog.percentage.toFixed(0)
                + '%'
            )
        })

        const out = fs.createWriteStream(
            path.join(
                cp.dirFullPath,
                path.basename(cp.fileFullPath)
            )
        )

        out.on('close', () => {
            this.copying = false
            this.q.pop()
            this.cpFileAndPop()
        })

        fs.createReadStream(cp.fileFullPath)
            .pipe(prog)
            .pipe(out)
    }

    private mkdirp = (dirFullPath) =>
        fs.existsSync(dirFullPath) ||
        fs.mkdirSync(dirFullPath)

    private cpDir = (sourceDirFullPath: string, targetDirFullPath: string) => {
        const destDir = path.join(
            targetDirFullPath,
            path.basename(sourceDirFullPath)
        );

        this.mkdirp(destDir)

        this.cp(
            fs.readdirSync(sourceDirFullPath)
                .map(file => path.join(sourceDirFullPath, file)),
            destDir
        )
    }

    private cp = (fullPaths: string[], distDirFullPath: string) => {
        fullPaths.forEach((fullPath) => {
            if (fs.statSync(fullPath).isDirectory())
                return this.cpDir(fullPath, distDirFullPath)

            this.q.unshift({
                fileFullPath: fullPath,
                dirFullPath: distDirFullPath
            })

            this.jumpFm.statusBar.msg(
                'q',
                'waiting: ' + path.basename(fullPath),
                ['warn']
            )
        })

        this.cpFileAndPop();
    }

    onLoad(): void {
        const selectedFiles = this.jumpFm.getActivePanel().getSelectedItemsUrls
        const distDir = this.jumpFm.getPassivePanel().getPath
        this.jumpFm.bindKeys('copy', ['f5'], () => {
            this.cp(selectedFiles(), distDir())
        })
    }
}

module.exports = PluginCopy
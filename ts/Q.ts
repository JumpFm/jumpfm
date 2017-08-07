import { JumpFm } from './JumpFm'
import { ProgressBar } from './ProgressBar'

import * as fileSize from 'filesize'
import * as fs from 'fs'
import * as path from 'path'
import * as progress from 'progress-stream'

class Cp {
  fileFullPath: string
  dirFullPath: string
}

export class Q {
  progress: ProgressBar
  copying: boolean = false

  model: { q: Cp[] } = {
    q: []
  }

  constructor(jumpFm: JumpFm) {
    this.progress = jumpFm.progressBar
  }

  private done = () => {
    this.progress.clear()
  }

  private cpFileAndShift = () => {
    if (this.model.q.length == 0) return this.done()
    if (this.copying) return

    this.copying = true

    const cp = this.model.q[0]

    const prog = progress({
      length: fs.statSync(cp.fileFullPath).size,
      time: 300
    }, (prog) => {
      this.progress.set(prog.percentage);
    });


    const out = fs.createWriteStream(
      path.join(
        cp.dirFullPath,
        path.basename(cp.fileFullPath)
      )
    );

    out.on('close', () => {
      this.progress.clear()
      this.copying = false
      this.model.q.shift()
      this.cpFileAndShift()
    });

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

  cp = (fullPaths: string[], distDirFullPath: string) => {
    fullPaths.forEach((fullPath) => {
      if (fs.statSync(fullPath).isDirectory())
        return this.cpDir(fullPath, distDirFullPath)

      this.model.q.push({
        fileFullPath: fullPath,
        dirFullPath: distDirFullPath
      })
    })

    this.cpFileAndShift();
  }
}
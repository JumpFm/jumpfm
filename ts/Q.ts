import { JumpFm } from './JumpFm'
import { StatusBar } from './StatusBar'
import { ProgressBar } from './ProgressBar'

import * as fileSize from 'filesize'
import * as fs from 'fs'
import * as path from 'path'
import * as progress from 'progress-stream'

class Task {
  file: string
  dir: string
}

export class Q {
  working = false
  q: Task[] = [];
  status: StatusBar
  progress: ProgressBar

  constructor(jumpFm: JumpFm) {
    this.status = jumpFm.statusBar
    this.progress = jumpFm.progressBar
  }

  private done = () => {
    this.status.clear()
    this.progress.clear()
  }

  private pop = () => {
    if (this.q.length == 0) return this.done()
    if (this.working) return;
    this.status.info('Copy ' + this.q.length + ' file(s)')
    const job = this.q.pop();
    this.cpFile(job.file, job.dir);
  }

  private cpFile = (file: string, dir: string) => {
    this.working = true;
    if (!fs.statSync(dir).isDirectory()) return;

    const prog = progress({
      length: fs.statSync(file).size,
      time: 1000
    }, (progress) => {
      this.progress.set(progress.percentage);
    });


    const out = fs.createWriteStream(path.join(dir, path.basename(file)));

    out.on('close', () => {
      this.working = false
      this.pop();
    });

    fs.createReadStream(file).pipe(prog).pipe(out);
  }

  private cpDir = (sourceDir: string, toDir: string) => {
    const destDir = path.join(toDir, path.basename(sourceDir));

    let _this = this

    function cpFiles() {
      fs.readdir(sourceDir, (err, files) => {
        _this.cp(
          files.map((file) => {
            return path.join(sourceDir, file);
          }),
          destDir);
      })
    }

    fs.exists(destDir, (b) => {
      if (b) return cpFiles()
      fs.mkdirSync(destDir)
      cpFiles();
    })
  }

  cp = (files: string[], dir: string) => {
    files.forEach((file) => {
      if (fs.statSync(file).isDirectory()) return this.cpDir(file, dir);
      this.q.push({ file: file, dir: dir });
    });
    this.pop();
  }
}
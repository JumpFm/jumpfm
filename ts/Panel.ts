import { JumpFm } from './JumpFm'
import { History } from './History'
import { FileInfo } from './FileInfo'
import { JumpDb } from './JumpDb'
import { misc } from './settings'

import * as fs from 'fs'
import * as path from 'path'
import * as watch from 'node-watch';

export class Panel {
    private watcher = { close: () => { } }
    private history = new History()
    private jumpDb
    private statusBar

    constructor(jumpFm: JumpFm) {
        this.jumpDb = jumpFm.jumpDb
        this.statusBar = jumpFm.statusBar
    }

    clear = () => {
        this.model.files = []
    }

    add = (file: FileInfo) => {
        this.model.files.push(file)
    }

    filter = (filter: string = undefined): void => {
        this.model.filter = filter
    }

    getCur = (): number => {
        return Math.min(
            this.getFiles().length - 1,
            Math.max(0, this.model.cur)
        )
    }

    getCurFile = (): FileInfo => {
        return this.getFiles()[this.getCur()]
    }

    setFiles = (files: FileInfo[]): void => {
        this.model.files = files
    }

    getFiles = (): FileInfo[] => {
        const filterFilter = (file) => {
            return file.name.toLowerCase().indexOf(this.model.filter.toLowerCase()) > -1
        }

        const filterHidden = (file) => {
            return this.model.showHidden || file.name.indexOf('.') != 0
        }

        return this.model.files
            .filter(filterFilter)
            .filter(filterHidden)
    }

    loadFiles = (cb: () => void = undefined): void => {
        const dirFullPath = this.model.pwd
        const fp = file => path.join(dirFullPath, file)
        fs.readdir(dirFullPath, (err, files) => {
            if (err) {
                console.log(err)
                return
            }
            this.setFiles(
                files.slice(0, misc.maxFilesInPanel).filter(
                    file => fs.existsSync(fp(file))
                ).map(file =>
                    new FileInfo(fp(file))
                    )
            )
            if (cb) cb()
        })
    }

    clearFilter = () => {
        this.filter('')
    }

    selectRange = (a, b) => {
        try {
            if (a > b) return this.selectRange(b, a)
            const files = this.getFiles()
            for (var i = a; i <= b; i++) files[i].sel = true
        } catch (e) {
            console.log(e, a, b)
        }
    }

    step = (d: number, select = false) => {
        const i1 = this.getCur()
        this.model.cur = this.getCur() + Math.floor(d)

        if (select) this.selectRange(i1, this.getCur())
    }

    back = (): void => {
        this.cd(this.history.back(), false)
    }

    forward = (): void => {
        this.cd(this.history.forward(), false)
    }

    title = (): string => {
        let title = this.model.pwd
        const filter = this.model.filter
        if (this.model.flatMode) title += "/** "
        if (filter) title += " [" + filter + "]"
        if (this.model.showHidden) title += " ."
        return title
    }

    select = (): void => {
        this.getCurFile().sel = true
    }

    toggleSel = (): void => {
        const f = this.getCurFile()
        f.sel = !f.sel
    }

    selectAll = (): void => {
        this.getFiles().forEach((file) => {
            file.sel = true
        })
    }

    deselectAll = (): void => {
        this.getFiles().forEach((file) => {
            file.sel = false
        })
    }

    getCurDir = (): string => {
        return this.model.pwd
    }

    getSelectedFiles = (): FileInfo[] => {
        return this.getFiles().filter((file, i) => {
            return file.sel || this.getCur() == i
        })
    }

    getSelectedFilesFullPath = (): string[] => {
        return this.getSelectedFiles().map((fileInfo) => {
            return fileInfo.fullPath
        })
    }

    cd = (dirFullPath: string, pushHistory: boolean = true): void => {
        if (!fs.existsSync(dirFullPath) ||
            !fs.statSync(dirFullPath).isDirectory()) return



        if (pushHistory) this.history.push(dirFullPath)
        this.jumpDb.visit(dirFullPath)

        this.model.pwd = dirFullPath
        this.model.flatMode = false
        this.clearFilter()

        this.watcher.close()

        this.loadFiles()

        this.watcher = watch(dirFullPath, { recursive: false }, () => {
            this.loadFiles()
        });
    }

    toggleFlatMode = (): void => {
        this.watcher.close()
        this.model.flatMode = !this.model.flatMode
        if (!this.model.flatMode) {
            this.cd(this.getCurDir())
        } else {
            if (!this.flat()) {
                this.statusBar.err('FlatMode Err: too many files')
                this.model.flatMode = false
                return
            }
            this.watcher = watch(this.model.pwd, { recursive: true }, () => {
                this.loadFiles(this.flat)
            });
        }
        this.statusBar.warn("FlatMode: " + (this.model.flatMode ? 'On' : 'Off'))
    }

    toggleShowHidden = () => {
        this.model.showHidden = !this.model.showHidden
    }

    private flat = (): boolean => {
        const pwd = this.model.pwd

        function flatDir(rootDir: string, res: FileInfo[]) {
            if (res.length > misc.maxFilesInPanel) return
            fs.readdirSync(rootDir).forEach((file) => {
                try {
                    const fullPath = path.join(rootDir, file)
                    const stat = fs.statSync(fullPath)

                    if (stat.isDirectory()) flatDir(fullPath, res)
                    if (stat.isFile())
                        res.push(new FileInfo(fullPath, fullPath.replace(pwd + '/', '')))
                } catch (e) {
                    console.log(e)
                }
            })
        }

        const res = []
        flatDir(pwd, res)

        if (res.length > misc.maxFilesInPanel) {
            return false
        }

        this.setFiles(res)
        return true
    }

    model = {
        pwd: "",
        files: [],
        cur: 0,
        filter: "",
        flatMode: false,
        showHidden: false,
        get: {
            cur: this.getCur,
            files: this.getFiles,
            title: this.title
        }
    }
}
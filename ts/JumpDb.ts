import { root, misc } from './settings'

import * as homedir from 'homedir'
import * as fs from 'fs'
import * as path from 'path'

const dbFullPath = path.join(root, "jumps.json");

const isHidden = (fullPath: string) => path.basename(fullPath).indexOf('.') == 0

function readDirFullPath(dirFullPath: string): string[] {
    try {
        return fs.readdirSync(dirFullPath)
            .map(file =>
                path.join(dirFullPath, file)
            ).filter(fullPath =>
                !isHidden(fullPath) &&
                fs.existsSync(fullPath) &&
                fs.statSync(fullPath).isDirectory()
            )
    } catch (e) {
        console.log(e)
        return []
    }
}

function bfs(dirFullPath: string, sizeLimit: number): string[] {
    const res: string[] = []
    const q: string[] = []

    q.push(dirFullPath)

    while (res.length < sizeLimit && q.length > 0) {
        const dirFullPath = q.shift()
        res.push(dirFullPath)
        q.push.apply(q, readDirFullPath(dirFullPath))
    }

    return res
}

export class JumpDb {
    db: string[] = this.loadDb();
    saveInterval = 0

    private loadDb() {
        if (fs.existsSync(dbFullPath)) {
            const db = require(dbFullPath)
            if (Array.isArray(db)) return db
        }
        const db =
            bfs(homedir(), misc.jump.dbMaxSize * 2 / 3)
                .concat(bfs('/', misc.jump.dbMaxSize * 1 / 3))
        fs.writeFileSync(dbFullPath, JSON.stringify(db))
        return db;
    }

    private saveDb = () => {
        fs.truncateSync(dbFullPath);
        fs.writeFileSync(dbFullPath, JSON.stringify(this.db));
    }

    visit = (dirFullPath: string): void => {
        this.db.splice(this.db.indexOf(dirFullPath), 1)
        this.db.splice(misc.jump.dbMaxSize)
        this.db.unshift(dirFullPath)
        if ((this.saveInterval++ % misc.jump.saveInterval) == 0) this.saveDb();
    };
}
import * as fs from 'fs';
import * as homedir from 'homedir';
import * as path from 'path';

import { root } from './files';

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
    readonly dbMaxSize
    readonly saveInterval
    readonly dbFullPath = path.join(root, 'jumps.json')
    readonly db: string[] = this.loadDb();
    visitCount = 0

    constructor(dbMaxSize: number, saveInterval: number) {
        this.dbMaxSize = dbMaxSize
        this.saveInterval = saveInterval
    }

    private loadDb() {
        if (fs.existsSync(this.dbFullPath)) {
            const db = require(this.dbFullPath)
            if (Array.isArray(db)) return db
        }
        const db =
            bfs(homedir(), this.dbMaxSize * 2 / 3)
                .concat(bfs(path.parse(homedir()).root, this.dbMaxSize * 1 / 3))
        fs.writeFileSync(this.dbFullPath, JSON.stringify(db))
        return db;
    }

    private saveDb = () => {
        fs.truncateSync(this.dbFullPath);
        fs.writeFileSync(this.dbFullPath, JSON.stringify(this.db));
    }

    visit = (dirFullPath: string): void => {
        this.db.splice(this.db.indexOf(dirFullPath), 1)
        this.db.splice(this.dbMaxSize)
        this.db.unshift(dirFullPath)

        if (this.visitCount++ % this.saveInterval) return
        this.saveDb();
    };
}
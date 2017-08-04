import { root } from './settings'

import * as homedir from 'homedir'
import * as fs from 'fs'
import * as path from 'path'

const dbFullPath = path.join(root, "jumps.json");

const isHidden = (fullPath: string) => path.basename(fullPath).indexOf('.') == 0

function readDirFullPath(dirFullPath: string): string[] {
    return fs.readdirSync(dirFullPath)
        .map(file =>
            path.join(dirFullPath, file)
        ).filter(fullPath =>
            !isHidden(fullPath) &&
            fs.existsSync(fullPath) &&
            fs.statSync(fullPath).isDirectory()
        )
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

    private loadDb() {
        if (fs.existsSync(dbFullPath)) {
            const db = require(dbFullPath)
            if (Array.isArray(db)) return db
        }
        const db = bfs(homedir(), 200)
        fs.writeFileSync(dbFullPath, JSON.stringify(db))
        return db;
    }

    private saveDb = () => {
        fs.truncateSync(dbFullPath);
        fs.writeFileSync(dbFullPath, JSON.stringify(this.db));
    }

    visit = (dirFullPath: string): void => {
        this.db.unshift(dirFullPath)
        // TODO save from time to time to improve performance
        this.saveDb();
    };
}
import { files } from './files'

import * as fs from 'fs'
import * as path from 'path'

const dbFullPath = path.join(files.root, "jumps.json");

export class JumpDb {
    private db = this.loadDb();

    private loadDb() {
        if (fs.existsSync(dbFullPath))
            return JSON.parse(fs.readFileSync(dbFullPath).toString());
        fs.writeFileSync(dbFullPath, JSON.stringify({}, null, 2))
        return {};
    }

    private saveDb = () => {
        fs.truncateSync(dbFullPath);
        fs.writeFileSync(dbFullPath, JSON.stringify(this.db, null, 2));
    }

    get = () => {
        return this.db
    }

    visit = (dirFullPath: string): void => {
        if (!this.db[dirFullPath]) this.db[dirFullPath] = 0;
        this.db[dirFullPath]++;
        // TODO save from time to time to improve performance
        this.saveDb();
    };
}
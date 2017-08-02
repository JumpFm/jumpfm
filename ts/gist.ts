import * as path from 'path'
import * as fs from 'fs'
import * as genReq from 'request'

export interface Gist {
    description: string
    filesFullPath: string[]
}

// REMOVE !!!!
// require('request-debug')(genReq);

var req = genReq.defaults({
    headers: { 'User-Agent': 'JumpFm' }
})

export function newPublicGist(gist: Gist, cb: (err, htmlUrl: string) => void) {
    const data = {
        description: gist.description,
        public: true,
        files: {}
    }

    gist.filesFullPath.forEach(file => {
        data.files[path.basename(file)] = {
            content: fs.readFileSync(file, { encoding: 'utf8' })
        }
    })

    req.post({
        url: 'https://api.github.com/gists',
        json: true,
        body: data
    }, (err, res, body) => {
        cb(err, body.html_url)
    })
}
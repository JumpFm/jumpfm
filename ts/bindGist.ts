import { JumpFm } from './JumpFm'
import { opn } from './opn'
import { keys } from './settings'

import * as mousetrap from 'mousetrap'
import * as path from 'path'
import * as fs from 'fs'
import * as genReq from 'request'

// REMOVE !!!!
// require('request-debug')(genReq);

var req = genReq.defaults({
    headers: { 'User-Agent': 'JumpFm' }
})

interface Gist {
    description: string
    filesFullPath: string[]
}

function newPublicGist(gist: Gist, cb: (err, htmlUrl: string) => void) {
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

export function bindGist(jumpFm: JumpFm) {
    const pan = () => jumpFm.panels.getActivePanel()

    const gist = () => {
        jumpFm.dialog.open({
            title: 'New Gist',
            init: (input) => {
                input.value = 'Gist Description'
                input.select()
            },
            ok: (description) => {
                jumpFm.statusBar.info('Creating Gist...')
                newPublicGist({
                    description: description,
                    filesFullPath: pan().getSelectedFilesFullPath()
                }, (err, url) => {
                    jumpFm.statusBar.info('Gist created at ' + url)
                    opn(url)
                })
            }
        })
        return false
    }

    keys.misc.gist.forEach(key => mousetrap.bind(key, gist))
}
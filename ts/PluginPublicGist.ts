import * as fs from 'fs';
import * as path from 'path';
import * as genReq from 'request';

import { opn } from './opn';
import { Plugin } from './Plugin';

interface Gist {
    description: string
    filesFullPath: string[]
}

class PluginPublicGist extends Plugin {
    label = 'New Gist Description'

    readonly req = genReq.defaults({
        headers: { 'User-Agent': 'JumpFm' }
    })

    newPublicGist(gist: Gist, cb: (err, htmlUrl: string) => void) {
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

        this.req.post({
            url: 'https://api.github.com/gists',
            json: true,
            body: data
        }, (err, res, body) => {
            cb(err, body.html_url)
        })
    }


    onDialogOpen = (input) => {
        input.value = 'Gist Description'
        input.select()
    }

    onAccept = (description) => {
        this.jumpFm.statusBar.info('gist', 'Creating Gist...')
        this.newPublicGist({
            description: description,
            filesFullPath: this.jumpFm.getActivePanel().getSelectedItemsPaths()
        }, (err, url) => {
            this.jumpFm.statusBar.info('gist', 'Gist created at ' + url, 5000)
            opn(url)
        })
    }

    onLoad(): void {
        const jumpFm = this.jumpFm

        jumpFm.bindKeys('publicGist', ['ctrl+g'], () => {
            jumpFm.dialog.open(this)
        })
    }
}

module.exports = PluginPublicGist
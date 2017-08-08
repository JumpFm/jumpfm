import { Plugin } from './Plugin'
import { JumpFm } from './JumpFm'
import { JumpDb } from './JumpDb'

import * as fs from 'fs'
import * as fuzzy from 'fuzzy'

class Jump extends Plugin {
    constructor(jumpFm: JumpFm) {
        super(jumpFm)
    }

    onLoad() {
        const jumpFm = this.jumpFm
        const jumpDb = new JumpDb()

        jumpFm.keys.bind('jump', 'j', () => {
            jumpFm.dialog.open({
                label: 'Jump',
                onChange: val => {
                    const files = jumpDb.db.filter(file => fs.existsSync(file))
                    const pattern = val.replace(/\s/, '')
                    const options = {
                        pre: '<b>',
                        post: '</b>'
                    }

                    return fuzzy.filter(pattern, files, options)
                        .sort((a, b) => (b.score - a.score) || (a.index - b.index))
                        .splice(0, 12)
                        .map(res => {
                            return {
                                value: res.original,
                                html: res.string
                            }
                        })

                },
                onAccept: (val, sug) => {
                    console.log(sug)
                },
            })
        })
    }
}

module.exports = Jump

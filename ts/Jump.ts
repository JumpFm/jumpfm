import { JumpFm } from './JumpFm'
import { JumpDb } from './JumpDb'

import * as fuzzy from 'fuzzy'
import * as autoComplete from 'js-autocomplete'
import * as Mousetrap from 'mousetrap'
import * as fs from 'fs'

export class Jump {
    private jumpFm: JumpFm
    private jumpDb

    private dialog: HTMLElement
    private title: HTMLElement
    private input: HTMLInputElement

    model = {
        cur: 1,
        res: []
    }

    constructor(jumpFm: JumpFm) {
        this.jumpFm = jumpFm
        this.jumpDb = jumpFm.jumpDb
    }


    close = (): void => {
        this.dialog.style.display = 'none';
    }

    open = (): void => {
        this.model.cur = 0;
        this.model.res = []
        this.dialog.style.display = 'flex';
        this.input.select();
    };

    init = () => {
        this.dialog = document.getElementById("jump")
        this.title = document.getElementById("jumpTitle")
        this.input = document.getElementById("jumpInput") as HTMLInputElement

        const mousetrap = new Mousetrap(this.input);
        mousetrap.bind('esc', this.close);
        mousetrap.bind('enter', () => {
            const selection = this.model.res[this.model.cur]
            this.jumpFm.panels.getActivePanel().cd(selection.original)
            this.close();
        });
        mousetrap.bind('down', () => {
            this.model.cur = Math.min(this.model.cur + 1, this.model.res.length - 1)
            return false
        })
        mousetrap.bind('up', () => {
            this.model.cur = Math.max(this.model.cur - 1, 0)
            return false
        })

        this.input.addEventListener('blur', this.close, false);

        const jumpDb = this.jumpDb

        this.input.addEventListener('keyup', () => {
            const files = jumpDb.db.filter(file => fs.existsSync(file))
            const pattern = this.input.value.replace(/\s/, '')
            const options = {
                pre: '<b>',
                post: '</b>'
            }
            this.model.res =
                fuzzy.filter(pattern, files, options)
                    .sort((a, b) => (b.score - a.score) || (a.index - b.index))
                    .splice(0, 12)
        }, false)
    }
}
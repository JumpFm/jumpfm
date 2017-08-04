import { JumpFm } from './JumpFm'
import { JumpDb } from './JumpDb'

import * as fuzzy from 'fuzzy'
import * as autoComplete from 'js-autocomplete'
import * as Mousetrap from 'mousetrap'
import * as fs from 'fs'

export class Jump {
    private cb
    private jumpDb

    private dialog = () => document.getElementById("jump")
    private title = () => document.getElementById("jumpTitle")
    private input = () => document.getElementById("jumpInput") as HTMLInputElement

    constructor(jumpFm: JumpFm) {
        this.jumpDb = jumpFm.jumpDb
    }


    close = (): void => {
        this.dialog().style.display = 'none';
    }

    open = (ok: (input: string) => void): void => {
        this.cb = ok;
        this.dialog().style.display = 'flex';
        this.input().select();
    };

    init = () => {
        const mousetrap = new Mousetrap(this.input());
        mousetrap.bind('esc', this.close);
        mousetrap.bind('enter', () => {
            this.cb(this.input().value);
            this.close();
        });

        this.input().addEventListener('blur', this.close, false);

        const jumpDb = this.jumpDb

        new autoComplete({
            minChars: 1,
            selector: '#jumpInput',
            source: function (pattern, suggest) {
                const files = jumpDb.db.filter(file => fs.existsSync(file))
                console.log(pattern, files)
                suggest(fuzzy.filter(pattern, files).map(res => res.string))
            }
        });
    }
}
import { JumpFm } from './JumpFm'
import { JumpDb } from './JumpDb'

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
            source: function (input, suggest) {
                const inputLc = input.toLowerCase();
                const sug = Object.keys(jumpDb.get()).filter((file) => {
                    return fs.existsSync(file);
                }).filter((file) => {
                    return file.toLowerCase().indexOf(inputLc) > -1;
                }).sort((f1, f2) => {
                    return jumpDb[f2] - jumpDb[f1];
                });
                suggest(sug);
            }
        });
    }
}
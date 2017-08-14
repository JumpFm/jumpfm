import { Plugin } from './Plugin'
import { cmds, saveCmds } from './files'

import * as format from 'string-template'
import * as mousetrap from 'mousetrap'
import * as child from 'child_process'

const defaultCmds = {
    gitDiffSelected: {
        keys: ['d'],
        template: 'git difftool {active_selected}'
    },
    gitDiffPwd: {
        keys: ['D'],
        template: 'git difftool {active_pwd}'
    },
    diffFile: {
        keys: ['ctrl+d'],
        template: 'meld {active_cur} {passive_cur}'
    }
}

interface CmdDesc {
    keys: string[]
    template: string
}

class PluginRunCmd extends Plugin {
    loadCmds = (): { [name: string]: CmdDesc } => {
        Object.keys(defaultCmds).forEach(name => {
            if (!cmds[name]) cmds[name] = defaultCmds[name]
        })
        saveCmds(cmds)
        return cmds
    }

    onLoad(): void {
        try {
            Object.values(this.loadCmds())
                .forEach(cmdDesc => this.bindCmd(cmdDesc))
        } catch (e) {
            console.log(e)
        }
    }

    bindCmd = (cmdDesc: CmdDesc) => {
        const jumpFm = this.jumpFm
        const status = jumpFm.statusBar
        const active = jumpFm.getActivePanel()

        cmdDesc.keys.forEach(key => {
            mousetrap.bind(key, () => {
                const cmd = this.cmd(cmdDesc.template)
                status.info('cmd', `exec: ${cmd}`, 5000)
                child.exec(cmd, {
                    cwd: active.getPath()
                }, (err, out) => {
                    if (err) status.err('cmdRes', err.message, 15000)
                    else status.info('cmdRes', out, 15000)
                })
            })
        })
    }

    cmd = template => {
        const jumpFm = this.jumpFm
        const panels = this.jumpFm.panels
        const active = jumpFm.getActivePanel()
        const passive = jumpFm.getPassivePanel()

        return format(template, {
            active_pwd: active.getPath(),
            active_cur: active.getCurItem().path,
            active_selected: active.getSelectedItemsPaths().join(' '),

            passive_pwd: passive.getPath(),
            passive_cur: passive.getCur()
        })
    }
}

module.exports = PluginRunCmd
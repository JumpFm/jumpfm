import { Plugin } from './Plugin'
import { cmds, saveCmds } from './files'

import * as format from 'string-template'
import * as mousetrap from 'mousetrap'
import * as child from 'child_process'

const defaultCmds = {
    gitDiffSelected: {
        keys: ['d'],
        template: 'git difftool {selected}'
    },
    gitDiffPwd: {
        keys: ['D'],
        template: 'git difftool {active}'
    },
    diffFile: {
        keys: ['ctrl+d'],
        template: 'meld {cur0} {cur1}'
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
        Object.values(this.loadCmds())
            .forEach(cmdDesc => this.bindCmd(cmdDesc))
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

        return format(template, {
            selected: active.getSelectedItemsPaths().join(' '),
            cur0: panels[0].getCurItem().path,
            cur1: panels[1].getCurItem().path,
            pwd0: panels[0].getPath(),
            pwd1: panels[1].getPath(),
            active: active.getPath(),
        })
    }
}

module.exports = PluginRunCmd
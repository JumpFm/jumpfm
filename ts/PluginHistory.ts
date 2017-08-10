import { JumpFm } from './JumpFm'
import { Plugin } from './Plugin'
import { Panel, Url } from './Panel'

class History {
    HISTORY_MAX_SIZE = 20
    history: Url[] = []
    panel: Panel
    i = 0

    constructor(panel: Panel) {
        this.panel = panel
        panel.listen(this)
    }

    onPanelCd = () => {
        const url = this.panel.getUrl()
        if (!url.query.history) this.push(url)
    }

    push = (url: Url) => {
        this.history.splice(0, this.i);
        this.i = 0;
        this.history.unshift(url);
        this.history.splice(this.HISTORY_MAX_SIZE);
        return url;
    }

    forward = (): Url => {
        this.i = Math.max(0, this.i - 1);
        return this.history[this.i];
    }

    back = (): Url => {
        this.i = Math.min(this.i + 1, this.history.length - 1);
        return this.history[this.i];
    }

}

class PluginHistory extends Plugin {
    histories: History[]

    onLoad(): void {
        const jumpFm: JumpFm = this.jumpFm
        const panels = jumpFm.panels
        this.histories = panels.map(panel => new History(panel))

        jumpFm.bindKeys('historyBack', ['alt+left'], () => {
            const i = jumpFm.model.activePanel
            const url = this.histories[i].back()
            url.query.history = true
            panels[i].cd(url)
        })

        jumpFm.bindKeys('historyForward', ['alt+right'], () => {
            const i = jumpFm.model.activePanel
            const url = this.histories[i].forward()
            url.query.history = true
            panels[i].cd(url)
        })
    }
}

module.exports = PluginHistory
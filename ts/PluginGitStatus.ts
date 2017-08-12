import * as findParentDir from 'find-parent-dir'
import * as nodegit from 'nodegit'
import * as path from 'path'
// import * as watch from 'watch'
import * as  watch from 'node-watch'

import { Panel } from './Panel';
import { Plugin } from './Plugin';

class GitStatus {
    readonly panel: Panel
    root: string
    watcher = { close: () => undefined }

    constructor(panel: Panel) {
        this.panel = panel
        panel.listen(this)
    }

    onPanelItemsSet = () => {
        const url = this.panel.getUrl()
        this.watcher.close()
        if (url.protocol) return
        this.root = findParentDir.sync(url.path, '.git')
        if (!this.root) return
        this.watcher = watch(this.root, { recursive: true }, this.updateStatus)
        this.updateStatus()
    }

    readonly classes = [
        'git-index-new',
        'git-index-modified',
        'git-index-deleted',
        'git-index-renamed',
        'git-index-typechange',
        'git-no-status',
        'git-no-status',
        'git-wt-new',
        'git-wt-modified',
        'git-wt-deleted',
        'git-wt-typechange',
        'git-wt-renamed',
        'git-wt-unreadable',
        'git-no-status',
        'git-ignored',
        'git-conflicted',
    ]

    private getClasses = (mask: number) => this.classes
        .filter((cls, i) => mask & (1 << i))

    updateStatus = () => {
        nodegit.Repository.open(this.root).then(repo => {
            this.panel.getItems().forEach(item => {
                const status = nodegit.Status.file(
                    repo,
                    path.relative(this.root, item.path)
                )
                item.classes.push(...this.getClasses(status))
            })
        })
    }
}

class PluginGitStatus extends Plugin {
    onLoad(): void {
        this.jumpFm.panels.forEach(panel => new GitStatus(panel))
    }
}

module.exports = PluginGitStatus
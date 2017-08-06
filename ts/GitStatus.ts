import * as homedir from 'homedir'
import * as fs from 'fs'
import * as path from 'path'
import * as nodegit from 'nodegit'

export interface GitStatus {
    CURRENT: boolean
    IGNORED: boolean
    CONFLICTED: boolean
    INDEX_NEW: boolean
    INDEX_MODIFIED: boolean
    INDEX_DELETED: boolean
    INDEX_RENAMED: boolean
    INDEX_TYPECHANGE: boolean
    WT_NEW: boolean
    WT_MODIFIED: boolean
    WT_DELETED: boolean
    WT_RENAMED: boolean
    WT_TYPECHANGE: boolean
    WT_UNREADABLE: boolean
}

export const repoRootDir = (dirFullPath: string): string => {
    if (dirFullPath.length < homedir().length) return undefined
    const gitPath = path.join(dirFullPath, '.git')
    if (fs.existsSync(gitPath)) return dirFullPath
    const dirs = dirFullPath.split(path.sep)
    dirs.pop()
    return repoRootDir(dirs.join('/'))
}

export const gitStatus = (flags: number = 0) => {
    return {
        CURRENT: !!(flags & nodegit.Status.STATUS.CURRENT),
        IGNORED: !!(flags & nodegit.Status.STATUS.IGNORED),
        CONFLICTED: !!(flags & nodegit.Status.STATUS.CONFLICTED),
        INDEX_NEW: !!(flags & nodegit.Status.STATUS.INDEX_NEW),
        INDEX_MODIFIED: !!(flags & nodegit.Status.STATUS.INDEX_MODIFIED),
        INDEX_DELETED: !!(flags & nodegit.Status.STATUS.INDEX_DELETED),
        INDEX_RENAMED: !!(flags & nodegit.Status.STATUS.INDEX_RENAMED),
        INDEX_TYPECHANGE: !!(flags & nodegit.Status.STATUS.INDEX_TYPECHANGE),
        WT_NEW: !!(flags & nodegit.Status.STATUS.WT_NEW),
        WT_MODIFIED: !!(flags & nodegit.Status.STATUS.WT_MODIFIED),
        WT_DELETED: !!(flags & nodegit.Status.STATUS.WT_DELETED),
        WT_RENAMED: !!(flags & nodegit.Status.STATUS.WT_RENAMED),
        WT_TYPECHANGE: !!(flags & nodegit.Status.STATUS.WT_TYPECHANGE),
        WT_UNREADABLE: !!(flags & nodegit.Status.STATUS.WT_UNREADABLE),
    }
}




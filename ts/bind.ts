import { JumpFm } from './JumpFm'

import { bindNav } from './bindNav'
import { bindSelection } from './bindSelection'
import { bindFilter } from './bindFilter'
import { bindFileOperations } from './bindFileOperations'
import { bindPanelOperations } from './bindPanelOperations'
import { bindGist } from './bindGist'

export function bind(jumpFm: JumpFm) {
    bindNav(jumpFm)
    bindSelection(jumpFm)
    bindFileOperations(jumpFm)
    bindPanelOperations(jumpFm)
    bindFilter(jumpFm)
    bindGist(jumpFm)
}
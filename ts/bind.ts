import { JumpFm } from './JumpFm'

import { bindNav } from './bindNav'
import { bindSelection } from './bindSelection'
import { bindMisc } from './bindMisc'
import { bindFileOperations } from './bindFileOperations'
import { bindPanelOperations } from './bindPanelOperations'
import { bindZip } from './bindZip'

export function bind(jumpFm: JumpFm) {
    bindNav(jumpFm)
    bindSelection(jumpFm)
    bindFileOperations(jumpFm)
    bindPanelOperations(jumpFm)
    bindMisc(jumpFm)
}
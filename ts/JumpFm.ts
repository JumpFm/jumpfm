import { JumpDb } from './JumpDb'
import { StatusBar } from './StatusBar'
import { Panels } from './Panels'
import { Jump } from './Jump'
import { Dialog } from './Dialog'
import { ProgressBar } from './ProgressBar'
import { Q } from './Q'

export class JumpFm {
    dialog = new Dialog()
    jumpDb = new JumpDb()
    statusBar = new StatusBar()
    progressBar = new ProgressBar()

    panels = new Panels(this)
    jump = new Jump(this)
    q = new Q(this)

    model = {
        'panels': this.panels.model,
        'status': this.statusBar.model,
        'progress': this.progressBar.model,
        'jumps': this.jump.model
    }

    init = () => {
        this.jump.init()
        this.dialog.init()
    }
}
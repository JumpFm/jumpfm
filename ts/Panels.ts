import { JumpFm } from './JumpFm'
import { JumpDb } from './JumpDb'
import { Panel } from './Panel'

export class Panels {
    private panels: Panel[]
    model

    constructor(jumpFm: JumpFm) {
        this.panels = [
            new Panel(jumpFm),
            new Panel(jumpFm)
        ]

        this.model = {
            active: 0,
            a: this.panels[0].model,
            b: this.panels[1].model,
            q: {
                size: 0,
                txt: "",
                prog: 0,
                active: false,
            }
        }
    }

    switch = () => {
        this.model.active = (this.model.active + 1) % 2
    }

    getActivePanel = (): Panel => {
        return this.panels[this.model.active]
    }

    getPassivePanel = (): Panel => {
        return this.panels[(this.model.active + 1) % 2]
    }

    getPanel = (i): Panel => {
        return this.panels[i]
    }
}
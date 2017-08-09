import { JumpFm } from './JumpFm'
import { JumpDb } from './JumpDb'
import { PanelView } from './PanelView'
import { Panel } from './Panel'

export class Panels {
    readonly panels = [new Panel(), new Panel()]

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

    model = {
        active: 0,
        a: this.panels[0].model,
        b: this.panels[1].model
    }
}
import { JumpFm } from './JumpFm'
import { JumpDb } from './JumpDb'
import { Table } from './Table'
import { Panel } from './Panel'

export class Panels {
    private panels = [
        new Panel(new Table('tbody0')),
        new Panel(new Table('tbody1'))
    ]

    model = {
        active: 0,
        a: this.panels[0].model,
        b: this.panels[1].model
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
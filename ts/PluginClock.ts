import * as moment from 'moment';

import { Plugin } from './Plugin';

class PluginClock extends Plugin {
    onLoad(): void {
        this.update()
        setInterval(this.update, 1000)
    }

    update = () => {
        this.jumpFm.statusBar.info('clock',
            moment(Date.now()).format(
                this.jumpFm.settings.getStr('dateFormat', 'MM/DD/YYYY hh:mm:ss')
            )
        )
    }
}

module.exports = PluginClock

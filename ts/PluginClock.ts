import { Plugin } from './Plugin'

import * as moment from 'moment'

class PluginClock extends Plugin {
    onLoad(): void {
        setInterval(() =>
            this.jumpFm.statusBar.info('clock',
                moment(Date.now()).format(
                    this.jumpFm.settings.getStr('dateFormat', 'MM/DD/YYYY hh:mm:ss')
                )
            )
            , 1000
        )
    }
}

module.exports = PluginClock

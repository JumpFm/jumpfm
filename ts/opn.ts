import * as cmd from 'node-cmd';
import { os } from 'node.os';

export function opn(file: string) {
    const util =
        os.isWin ? 'start' :
            os.isMac ? 'open' :
                'xdg-open'
    cmd.run(util + ' "' + file + '"');
}
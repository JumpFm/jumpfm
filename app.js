const updater = require('electron-simple-updater');
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// const log = require('electron-log');

app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function() {
    updater.init(
        'https://raw.githubusercontent.com/Gilad-Kutiel-App/jumpfm/master/updates.json'
    );

    const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
    const w = parseInt(width * .8);
    const h = parseInt(height * .8);

    global.argv = process.argv
        // log.transports.file.level = 'debug';
        // log.transports.console.level = 'debug';

    // Create the browser window.
    let mainWindow = new BrowserWindow({
        width: w,
        height: h,
        icon: path.join(__dirname, 'build/icons/64x64.png'),
    });

    // mainWindow.setMenu(null);
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});
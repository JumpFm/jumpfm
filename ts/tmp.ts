import * as npm from 'npm'
import * as fs from 'fs-extra'

fs.mkdirp('/home/gilad/.jumpfm/plugins')
process.chdir('/home/gilad/.jumpfm/plugins')
// fs.writeJsonSync('/home/gilad/.jumpfm/plugins/package.json', {})
npm.load({
    save: true
}, (err, res) => {
    console.log(npm.dir)
    console.log(npm.root)
    // npm.commands.install(['jumpfm-clock'], (err, res) => {
    //     console.log(err, res)
    // })
    npm.commands.outdated([], (err, res) => {
        console.log(err, res)
    })
    npm.commands.update([], (err, res) => {
        console.log(err, res)
    })
})
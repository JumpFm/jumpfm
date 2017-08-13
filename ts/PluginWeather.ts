import { Plugin } from './Plugin'

import * as weather from 'weather-js'

interface CurrentWeather {
    temperature: number
    skycode: number
    skytext: string
    date: string
    observationtime: string
    observationpoint: string
    feelslike: number
    humidity: number
    winddisplay: string
    day: string
    shortday: string
    windspeed: string
    imageUrl: string
}

class PluginWeather extends Plugin {
    public onLoad(): void {
        this.update()
        setInterval(this.update, 36000)
    }

    update = () => {
        weather.find({
            search: this.jumpFm.settings.getStr('weatherLocation', 'Haifa, IL'),
            degreeType: 'C'
        },
            (err, res) => {
                if (err) console.log(err);
                const cur = res[0].current as CurrentWeather
                const temp = cur.temperature
                const cls =
                    temp < 25 ? 'info' : (
                        temp < 35 ? 'warn' :
                            'err'
                    )

                this.jumpFm.statusBar.msg([cls])(
                    'weather',
                    `${cur.temperature}° ${cur.humidity}% ${cur.windspeed}`
                )

            });
    }
}

module.exports = PluginWeather
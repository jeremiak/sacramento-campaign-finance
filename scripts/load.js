import _ from 'lodash'
import Queue from "p-queue"
import exec from './exec.js'

const years = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]
const schedules = ['schedule-a', 'schedule-c']

export default async function load(dbPath) {
    const queue = new Queue({ concurrency: 1 })

    years.forEach(year => {
        schedules.forEach(schedule => {
            queue.add(async() => {
                const s = _.startCase(schedule).replace(' ', '')
                const cmd = `sqlite-utils insert ${dbPath} ${s} data/${schedule}-${year}.json --pk=id`
                await exec(cmd)
            })
        })
    })

    await queue.onIdle()

    return
}
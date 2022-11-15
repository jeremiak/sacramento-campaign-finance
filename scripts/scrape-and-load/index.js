import Queue from 'p-queue'
import { PrismaClient } from "@prisma/client"
import exec from '../exec.js'
import download from "./download.js"
import extract from "./extract.js"
import load from "./load.js"

const prisma = new PrismaClient()
async function main({ agencyName, agencyId, year }) {
    const opts = { agencyName, agencyId, year }

    const f = `${agencyName} (${agencyId} - ${year})`

    console.log(`Ok, running for ${f}`)
    await exec(`mkdir -p tmp`)

    console.log(`Downloading ${f}...`)
    await download(opts)
    console.log(`Downloaded ${f}`)

    console.log(`Extracting ${f}...`)
    try {
        await extract(opts)
        console.log(`Extracted ${f}`)
    } catch (e) {
        if (e.code === 9) {
            console.log(`Problem extracting ${f}, skipping it`)
        } else {
            console.error(`Error with extaction`, e.code)
        }
        return
    }

    console.log(`Saving ${f} to database...`)
    await load(opts)
    console.log(`Saved ${f} to database`)

    console.log(`Done with ${f}`)
    return
}

const queue = new Queue({ concurrency: 1 })
const sitesToScrape = [{
        entity: "Sacramento City",
        vendorId: "SAC",
    },
    {
        entity: "Sacramento County",
        vendorId: "SCO",
    },
]

const startTime = new Date()
console.log(`Starting at ${startTime}`)

const year = "2022"
console.log(`First step is to remove any records from ${year}`)
const models = [
    'scheduleAContribution',
    'scheduleCContribution',
    'scheduleEPayment',
    'lateContribution',
    'independentExpenditure',
]
let totalDeleted = 0
const thisYearToDeleteQueue = new Queue({ concurrency: 1 })
models.forEach(model => {
    thisYearToDeleteQueue.add(async() => {
        const match = await prisma[model].deleteMany({
            where: {
                reportFromDate: {
                    contains: year
                }
            }
        })
        if (!match) return
        totalDeleted += match.count
    })
})
await thisYearToDeleteQueue.onIdle()
console.log(`Deleted ${totalDeleted} records from ${year}`)

sitesToScrape.forEach((site) => {
    const { entity: agencyName, vendorId: agencyId } = site
    queue.add(async() => {
        await main({ agencyName, agencyId, year })
        return
    })
})

queue.onIdle().then(async() => {
    const endTime = new Date()
    const durationMs = endTime - startTime
    const durationSec = durationMs / 1000
    const durationMin = durationSec / 60

    console.log(
        `Finished at ${endTime}, took about ${Math.ceil(durationMin)} minute${
      Math.ceil(durationMin) !== 1 ? "s" : ""
    }`
    )

    const formattedEndDate = `${endTime.getFullYear()}-${
        endTime.getMonth() + 1
    }-${endTime.getDate()}`

    process.exit(0)
})
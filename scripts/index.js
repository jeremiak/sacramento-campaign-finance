import Queue from 'p-queue'

import aggregate from './aggregate.js'
import exec from './exec.js'
import download from "./download.js"
import extract from "./extract.js"
import transform from "./transform.js"
import load from "./load.js"

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

sitesToScrape.forEach((site) => {
    const { entity: agencyName, vendorId: agencyId } = site
    queue.add(async() => {
        const year = "2023"
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
                console.log(`Problem extracting ${f}, skipping it`, e)
            } else {
                console.error(`Error with extaction`, e.code)
            }
            return
        }

        await exec(`mkdir -p data`)
        console.log(`Transforming ${f}...`)
        await transform(opts)
        console.log(`Transformed ${f}`)

        console.log(`Done with ${f}`)
        return
    })
})

queue.onIdle().then(async() => {
    console.log(`Loading JSON files into one database`)
    const databasePath = 'prisma/data.db'
    await exec(`rm -f ${databasePath}`)
    await load(databasePath)
    await aggregate('sac-city', { startTime })

    const endTime = new Date()
    const durationMs = endTime - startTime
    const durationSec = durationMs / 1000
    const durationMin = durationSec / 60

    console.log(
        `Finished at ${endTime}, took about ${Math.ceil(durationMin)} minute${
      Math.ceil(durationMin) !== 1 ? "s" : ""
    }`
    )

    process.exit(0)
})
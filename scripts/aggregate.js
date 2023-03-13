import _ from 'lodash'
import { rollup, sum } from 'd3-array'
import { promises as fs } from 'fs'
import Queue from 'p-queue'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const bodiesWithLegislators = [{
        body: 'sac-city',
        legislators: [{
                name: 'Darrell Steinberg',
                title: 'Mayor',
                committees: ['1396270', '1380886', '1388020', '1426136', '1237420']
            },
            {
                name: 'Lisa Kaplin',
                title: 'City Council, District 1',
                committees: ['1442529']
            },
            // {
            //     name: 'Angelique Ashby',
            //     title: 'City Council, District 1',
            //     committees: ['1317954', '1328332', '1368431', '1413885', '1380792']
            // },
            {
                name: 'Sean Loloee',
                title: 'City Council, District 2',
                committees: ['1419806', '1441736']
            },
            {
                name: 'Karina Talamantes',
                title: 'City Council, District 3',
                committees: ['1443537']
            },
            // {
            //     name: 'Jeff Harris',
            //     title: 'City Council, District 3',
            //     committees: ['1360063', '1381344', '1422765']
            // },
            {
                name: 'Katie Valenzuela',
                title: 'City Council, District 4',
                committees: ['1416339', '1426389']
            },
            {
                name: 'Caity Maple',
                title: 'City Council, District 5',
                committees: ['1435034']
            },
            // {
            //     name: 'Jay Schenirer',
            //     title: 'City Council, District 5',
            //     committees: ['1377848', '1317587', '1336600', '1367864']
            // },
            {
                name: 'Eric Guerra',
                title: 'City Council, District 6',
                committees: ['1374232', '1368754', '1376768', '1396274', '1431012']
            },
            {
                name: 'Rick Jennings',
                title: 'City Council, District 7',
                committees: ['1359899', '1367862', '1443348']
            },
            {
                name: 'Mai Vang',
                title: 'City Council, District 8',
                committees: ['1381818', '1435334', '1420665']
            }
        ]
    },
    {
        body: 'sac-county',
        legislators: [{
            name: 'Phil Sterna',
            title: 'Supervisor, District 1',
            committees: []
        }]
    }
]

function createContributorId(d) {
    return [
        d.contributorCommitteeId,
        d.contributorLastName,
        d.contributorFirstName,
        d.contributorZip,
    ].join('--')
}

export default async function aggregate(body, opts) {
    const { startTime } = opts
    const { legislators } = bodiesWithLegislators.find(d => d.body === body)
    const legislatorsWithContributors = []
    const queue = new Queue({ concurrency: 2 })

    legislators.forEach(legislator => {
        const { name, title, committees } = legislator
        queue.add(async() => {
            const scheduleA = await prisma.scheduleA.findMany({
                where: {
                    fppcId: { in: committees
                    }
                }
            })

            const rolled = rollup(scheduleA, contributions => {
                const amount = sum(contributions, d => d.amount)
                const {
                    filerName,
                    fppcId,
                    contributorCommitteeId,
                    contributorFirstName,
                    contributorLastName,
                    contributorCity,
                    contributorState,
                    contributorType,
                    contributorZip,
                } = contributions[0]
                return {
                    filerName,
                    fppcId,
                    contributorCommitteeId,
                    contributorFirstName,
                    contributorLastName,
                    contributorCity,
                    contributorState,
                    contributorType,
                    contributorZip,
                    amount
                }
            }, createContributorId)

            const contributors = Array.from(rolled).map(d => d[1])
            const sorted = _.orderBy(contributors, ['amount'], ['desc'])

            legislatorsWithContributors.push({
                name,
                title,
                committees,
                contributors: sorted
            })
        })
    })

    await queue.onIdle()

    const p = `src/lib/data-${body}.json`
    const d = {
        generated: startTime,
        data: legislatorsWithContributors
    }
    await fs.writeFile(p, JSON.stringify(d, null, 2))
}
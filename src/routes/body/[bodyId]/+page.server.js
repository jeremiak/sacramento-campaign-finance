import Queue from 'p-queue'
import { PrismaClient } from '@prisma/client'

import { normalizeContributorLastName } from '$lib/normalize'

const prisma = new PrismaClient()

async function aggregateContributorsByCommittee(committeeIds) {
    const scheduleA = await prisma.scheduleAContribution.findMany({
        where: {
            filer: {
                id: { in: committeeIds
                }
            }
        }
    })
    const late = await prisma.lateContribution.findMany({
        where: {
            filer: {
                id: { in: committeeIds
                }
            }
        }
    })
    const results = [
        ...scheduleA
    ]

    late.forEach(lateContribution => {
        const scheduleAMatch = scheduleA.find(d => d.transactionId === lateContribution.transactionId)
        if (scheduleAMatch) return

        results.push(lateContribution)
    })

    function slimContributor(contributor) {
        const {
            date,
            amount,
            contributorCommitteeId,
            contributorFirstName,
            contributorLastName,
            contributorCity,
            contributorState,
            contributorZip,
        } = contributor
        return {
            date,
            amount,
            contributorCommitteeId,
            contributorFirstName,
            contributorLastName: normalizeContributorLastName(contributorLastName),
            contributorCity,
            contributorState,
            contributorZip,
        }
    }

    const totalByContributor = results.reduce((accum, next) => {
        const normalizedLastName = normalizeContributorLastName(next.contributorLastName)
        const key = next.contributorFirstName !== '' ? `${next.contributorFirstName}-${normalizedLastName}-${next.contributorZip}` : `${normalizedLastName}`
        const match = accum[key]

        if (match) {
            match.total = match.total + next.amount
            match.contributions.push(slimContributor(next))
        } else {
            accum[key] = {
                total: next.amount,
                contributions: [slimContributor(next)]
            }
        }

        return accum
    }, {})

    const aggregated = []

    Object.keys(totalByContributor).forEach(key => {
        const value = totalByContributor[key]
        const { contributorFirstName, contributorLastName, contributorCity, contributorState } = value.contributions[0]
        aggregated.push({
            contributor: contributorFirstName === '' ? contributorLastName : `${contributorFirstName} ${contributorLastName}`,
            contributorCity,
            contributorState,
            ...value,
        })
    })

    const sorted = aggregated.sort((a, b) => {
        return b.total - a.total
    })

    return sorted
}



export async function load({ params }) {
    const { bodyId } = params

    const legislators = {
        'sac-city': [{
                name: 'Darrell Steinberg',
                title: 'Mayor',
                committees: ['1396270', '1380886', '1388020', '1426136', '1237420']
            },
            {
                name: 'Angelique Ashby',
                title: 'City Council, District 1',
                committees: ['1317954', '1328332', '1368431', '1413885', '1380792']
            },
            {
                name: 'Sean Loloee',
                title: 'City Council, District 2',
                committees: ['1419806', '1441736']
            },
            {
                name: 'Jeff Harris',
                title: 'City Council, District 3',
                committees: ['1360063', '1381344', '1422765']
            },
            {
                name: 'Katie Valenzuela',
                title: 'City Council, District 4',
                committees: ['1416339', '1426389']
            },
            {
                name: 'Jay Schenirer',
                title: 'City Council, District 5',
                committees: ['1377848', '1317587', '1336600', '1367864']
            },
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
    }

    const bodyLegislators = legislators[bodyId]
    const queue = new Queue({ concurrency: 2 })

    bodyLegislators.forEach(legislator => {
        queue.add(async() => {
            legislator.contributors = await aggregateContributorsByCommittee(legislator.committees)
        })
    })

    await queue.onIdle()

    return {
        bodyId,
        legislators: bodyLegislators
    }
}
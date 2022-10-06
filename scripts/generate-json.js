import _ from 'lodash'
import { csvParse } from 'd3-dsv'
import { promises as fs } from 'fs'
import fetch from 'isomorphic-fetch'
import Queue from 'p-queue'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fetchCsv(url) {
    const response = await fetch(url)
    const text = await response.text()
    const csv = csvParse(text)

    const withNormalizedKeys = csv.map(d => {
        const dd = {}

        Object.keys(d).forEach(key => {
            const normalized = key.toLowerCase().trim()
            dd[normalized] = d[key]
        })

        return dd
    })

    return withNormalizedKeys
}

async function fetchCandidateCommittees() {
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTYknxsCYe8BIY7UjLTuqFP9bbohEpJdnXo-GfuemreQfB5eQyrA08Yg2CDZ6OWz7KT_Nhech_kilEP/pub?gid=0&single=true&output=csv'
    const committees = await fetchCsv(sheetUrl)

    return committees
}

async function fetchBallotMeasureCommittees() {
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTYknxsCYe8BIY7UjLTuqFP9bbohEpJdnXo-GfuemreQfB5eQyrA08Yg2CDZ6OWz7KT_Nhech_kilEP/pub?gid=1703417596&single=true&output=csv'
    const committees = await fetchCsv(sheetUrl)

    return committees
}

async function fetchIEs() {
    const expenditures = await prisma.independentExpenditure.findMany({
        include: {
            filer: true
        }
    })
    const normalized = expenditures.map(expenditure => {
        const { candidateLastName } = expenditure
        let normalizedCandidateLastName = candidateLastName

        if (candidateLastName === 'PATRICK HUME') {
            normalizedCandidateLastName = 'Pat Hume'
        }

        return {
            ...expenditure,
            candidateLastName: normalizedCandidateLastName
        }
    })

    return normalized
}

async function aggregateContributorsByCommittee(committeeId) {
    const scheduleA = await prisma.scheduleAContribution.findMany({
        where: {
            filer: {
                id: committeeId
            }
        }
    })
    const late = await prisma.lateContribution.findMany({
        where: {
            filer: {
                id: committeeId
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
            contributorLastName,
            contributorCity,
            contributorState,
            contributorZip,
        }
    }

    const totalByContributor = results.reduce((accum, next) => {
        const key = next.contributorFirstName !== '' ? `${next.contributorFirstName}-${next.contributorLastName}-${next.contributorZip}` : `${next.contributorLastName}-${next.contributorZip}`
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

async function main() {
    const q = new Queue({ concurrency: 1 })
    const candidateCommittees = await fetchCandidateCommittees()
    const ballotMeasureCommittees = await fetchBallotMeasureCommittees()
    const committees = [...candidateCommittees, ...ballotMeasureCommittees]
    const data = []
    const ies = await fetchIEs()

    committees.forEach(committee => {
        q.add(async() => {
            const fppcId = committee['fppc id']
            const contributors = await aggregateContributorsByCommittee(fppcId)
            const total = contributors.reduce((accum, next) => {
                return accum + next.total
            }, 0)
            const ie = ies.filter(d => d.candidateLastName === committee['name']).map(d => {
                const { amount, date, description, position, candidateLastName: candidate } = d
                const { name: spenderName, id: spenderId } = d.filer

                return {
                    spenderName,
                    spenderId,
                    amount,
                    date,
                    candidate,
                    position,
                    description,
                }
            }).reduce((accum, next) => {
                const {
                    spenderName,
                    spenderId,
                    amount,
                    position,
                } = next
                const match = accum.find(d => d.spenderId === spenderId)

                if (match) {
                    match.total += amount
                } else {
                    accum.push({
                        spenderId,
                        spenderName,
                        position,
                        total: amount
                    })
                }

                return accum
            }, [])
            const d = {
                ...committee,
                total,
                contributors,
                ie
            }
            data.push(d)
        })
    })

    const toWrite = {
        generated: new Date(),
        committees: data
    }

    await q.onIdle()
    await fs.writeFile('src/lib/data.json', JSON.stringify(toWrite, null, 2))
    process.exit(0)
}

main()
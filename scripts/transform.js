import { promises as fs } from 'fs'

import _ from "lodash"
import excelToJson from "convert-excel-to-json"
import { timeFormat } from "d3-time-format"
import Queue from "p-queue"

const entityTypeMapping = {
    COM: "committee",
    RCP: "recipient-committee",
    IND: "individual",
    OTH: "other",
    PTY: "political-party",
    SCC: "small-contributor-committee",
}

const formatDate = timeFormat('%Y-%m-%d')

function getTransactionId({
    fppcId,
    reportNumber,
    reportDate,
    transactionId,
    agencyId
}) {
    const id = [
        fppcId,
        agencyId,
        reportNumber,
        reportDate,
        transactionId,
    ].join("-").replace('#', '')
    return id
}

function coerceScheduleC(contribution) {
    const {
        A: fppcId,
        B: filerName,
        C: reportNumber,
        D: committeeType,
        E: reportDate,
        F: reportFromDate,
        G: reportThruDate,
        M: transactionId,
        N: contributorType,
        AB: date,
        AD: amount,
        AF: description,
        AG: contributorCommitteeId,
        O: contributorLastName,
        P: contributorFirstName,
        // Q: contributorPrefix,
        // R: contributorSuffix,
        S: contributorAddress1,
        T: contributorAddress2,
        U: contributorCity,
        V: contributorState,
        W: contributorZip,
        Y: contributorOccupation,
        X: contributorEmployer,
        Z: contributorSelfEmployed,
    } = contribution

    return {
        fppcId,
        transactionId,
        filerName,
        committeeType,
        date: formatDate(date),
        amount,
        description,
        contributorType: entityTypeMapping[contributorType],
        contributorLastName: normalizeContributorLastName(contributorLastName),
        contributorFirstName,
        contributorAddress1,
        contributorAddress2,
        contributorCity,
        contributorState,
        contributorZip: contributorZip.replace(/-$/, ""),
        contributorOccupation,
        contributorEmployer,
        contributorSelfEmployed: contributorSelfEmployed === "y",
        contributorCommitteeId,
        reportNumber: +reportNumber,
        reportDate: formatDate(reportDate),
        reportFromDate: formatDate(reportFromDate),
        reportThruDate: formatDate(reportThruDate),
    }
}

function normalizeContributorLastName(name) {
    if (name.includes('AT&T')) return 'AT&T'
    if (name.includes('California Apartment Association')) return 'California Apartment Association'
    if (name.includes('California Correctional Peace Officers Association Political Action Committee')) return 'California Correctional Peace Officers Association'
    if (name.includes('CCPOA Local PAC')) return 'California Correctional Peace Officers Association'
    if (name.includes('California Association Of Realtors')) return 'California Association Of Realtors'
    if (name.includes('CREPAC')) return 'California Association of Realtors'
    if (name.includes('California Real Estate Political Action Committee')) return 'California Association of Realtors'
    if (name.includes('California Nurses Association')) return 'California Nurses Association'
    if (name.includes('Electrical Workers Local 340')) return 'International Brotherhood of Electrical Workers Local 340'
    if (name.includes('Pipefitters Local Union 447')) return 'Plumbers & Pipefitters Local Union 447'
    if (name.includes('Pipefitters Local Union No. 447')) return 'Plumbers & Pipefitters Local Union 447'
    if (name.includes('Plumbers & Pipefitters Local 447 Federal PAC')) return 'Plumbers & Pipefitters Local Union 447'
    if (name.includes('Sacramento Area Fire Fighters Local 522')) return 'Sacramento Area Fire Fighters Local 522'
    if (name.includes('Sacramento Area Firefighters Local 522 PAC')) return 'Sacramento Area Fire Fighters Local 522'
    if (name.includes('Sacramento Area Firefighters (SAFF) Local 522')) return 'Sacramento Area Fire Fighters Local 522'
    if (name.includes('Sacramento City Teachers Association')) return 'Sacramento City Teachers Association'
    if (name.includes('Sac City Teachers Association')) return 'Sacramento City Teachers Association'
    if (name.includes('Sacramento County Deputy Sheriffs Association')) return 'Sacramento County Deputy Sheriffs Association'
    if (name.includes('Sacramento Police Officers Association')) return 'Sacramento Police Officers Association'
    if (name.includes('Charter Public Schools PAC')) return 'California Charter Schools Association'
    if (name.includes('SEIU') && name.includes('1000')) return 'Service Employees International Union Local 1000'
    if (name.includes('Service Employees International Union Local 1000')) return 'Service Employees International Union Local 1000'
    return name
}

// async function createOrIgnoreScheduleE(payment, agency) {
//     const {
//         A: fppcId,
//         B: filerName,
//         C: reportNumber,
//         D: committeeType,
//         E: reportDate,
//         F: reportFromDate,
//         G: reportThruDate,
//         M: transactionId,
//         N: payeeType,
//         X: date,
//         Y: amount,
//         O: payeeLastName,
//         P: payeeFirstName,
//         S: payeeAddress1,
//         T: payeeAddress2,
//         U: payeeCity,
//         V: payeeState,
//         W: payeeZip,
//         AB: code,
//         AC: description,
//         AH: payeeCommitteeId,
//     } = payment

//     const paymentId = getTransactionId({
//         agencyStringId: agency.stringId,
//         fppcId,
//         reportNumber,
//         reportDate,
//         transactionId,
//     })

//     const filer = await findOrCreateFiler({
//         committeeType,
//         id: fppcId,
//         name: filerName,
//     })
//     const matchingAgency =
//         filer.agencies &&
//         filer.agencies.find((a) => {
//             return a.stringId === agency.id
//         })
//     if (!matchingAgency) {
//         await connectFilerToAgency(filer, agency)
//     }

//     try {
//         await prisma.scheduleEPayment.create({
//             data: {
//                 id: paymentId,
//                 transactionId,
//                 date: formatDate(date),
//                 amount,
//                 description,
//                 code,
//                 payeeType: entityTypeMapping[payeeType],
//                 payeeLastName,
//                 payeeFirstName,
//                 payeeAddress1,
//                 payeeAddress2,
//                 payeeCity,
//                 payeeState,
//                 payeeZip: payeeZip.replace(/-$/, ""),
//                 payeeCommitteeId,
//                 reportNumber: +reportNumber,
//                 reportDate: formatDate(reportDate),
//                 reportFromDate: formatDate(reportFromDate),
//                 reportThruDate: formatDate(reportThruDate),
//                 filer: {
//                     connect: { id: filer.id },
//                 },
//                 agency: {
//                     connect: { id: agency.id },
//                 },
//             },
//         })
//     } catch (e) {
//         if (e.code === "P2002") {
//             // uniqueness constraint failed, transaction already added
//             return
//         }

//         console.error(e)
//         debugger
//     }

//     console.log(`Saved payment ${paymentId}`)
// }

// async function createOrIgnoreLateContribution(contribution, agency) {
//     const {
//         A: fppcId,
//         B: filerName,
//         C: reportNumber,
//         D: committeeType,
//         E: reportDate,
//         F: reportFromDate,
//         G: reportThruDate,
//         K: transactionId,
//         L: contributorType,
//         M: contributorLastName,
//         N: contributorFirstName,
//         Q: contributorAddress1,
//         R: contributorAddress2,
//         S: contributorCity,
//         T: contributorState,
//         U: contributorZip,
//         V: contributorOccupation,
//         W: contributorEmployer,
//         X: contributorSelfEmployed,
//         Z: date,
//         AB: amount,
//         AC: contributorCommitteeId,
//     } = contribution

//     const contributionId = getTransactionId({
//         agencyStringId: agency.stringId,
//         fppcId,
//         reportNumber,
//         reportDate,
//         transactionId,
//     })

//     const filer = await findOrCreateFiler({
//         committeeType,
//         id: fppcId,
//         name: filerName,
//     })
//     const matchingAgency =
//         filer.agencies &&
//         filer.agencies.find((a) => {
//             return a.stringId === agency.id
//         })
//     if (!matchingAgency) {
//         await connectFilerToAgency(filer, agency)
//     }


//     try {
//         await prisma.lateContribution.create({
//             data: {
//                 id: contributionId,
//                 transactionId,
//                 date: formatDate(date),
//                 amount,
//                 contributorType: entityTypeMapping[contributorType],
//                 contributorCommitteeId,
//                 contributorLastName,
//                 contributorFirstName,
//                 contributorAddress1,
//                 contributorAddress2,
//                 contributorCity,
//                 contributorState,
//                 contributorZip: contributorZip.replace(/-$/, ""),
//                 contributorOccupation,
//                 contributorEmployer,
//                 contributorSelfEmployed: contributorSelfEmployed === "y",
//                 reportNumber: +reportNumber,
//                 reportDate: formatDate(reportDate),
//                 reportFromDate: formatDate(reportFromDate),
//                 reportThruDate: formatDate(reportThruDate),
//                 filer: {
//                     connect: { id: filer.id },
//                 },
//                 agency: {
//                     connect: { id: agency.id },
//                 },
//             },
//         })
//         console.log(`Saved contribution ${contributionId}`)
//     } catch (e) {
//         if (e.code === "P2002") {
//             // uniqueness constraint failed, transaction already added
//             return
//         }

//         console.error(e)
//     }

// }

// async function createOrIgnoreIndependentExpenditure(independentExpenditure, agency) {
//     const {
//         A: fppcId,
//         B: filerName,
//         C: reportNumber,
//         D: committeeType,
//         E: reportDate,
//         F: reportFromDate,
//         G: reportThruDate,
//         K: transactionId,
//         L: amount,
//         M: date,
//         O: description,
//         R: ballotMeasureName,
//         S: ballotMeasureNumber,
//         U: position,
//         V: candidateLastName,
//         W: candidateFirstName,
//         Z: officeCode,
//         AA: officeDescription,
//         AC: jurisdiction,
//         AD: district,
//         AE: reportIdNumber,
//     } = independentExpenditure

//     const paymentId = getTransactionId({
//         agencyStringId: agency.stringId,
//         fppcId,
//         reportNumber,
//         reportDate,
//         transactionId,
//     })

//     const filer = await findOrCreateFiler({
//         committeeType,
//         id: fppcId,
//         name: filerName,
//     })
//     const matchingAgency =
//         filer.agencies &&
//         filer.agencies.find((a) => {
//             return a.stringId === agency.id
//         })
//     if (!matchingAgency) {
//         await connectFilerToAgency(filer, agency)
//     }

//     try {
//         await prisma.independentExpenditure.create({
//             data: {
//                 id: paymentId,
//                 transactionId,
//                 date: formatDate(date),
//                 amount,
//                 description,
//                 amount,
//                 date,
//                 description,
//                 ballotMeasureName,
//                 ballotMeasureNumber,
//                 position,
//                 candidateLastName,
//                 candidateFirstName,
//                 officeCode,
//                 officeDescription,
//                 jurisdiction,
//                 district,
//                 reportIdNumber,
//                 reportNumber: +reportNumber,
//                 reportDate: formatDate(reportDate),
//                 reportFromDate: formatDate(reportFromDate),
//                 reportThruDate: formatDate(reportThruDate),
//                 filer: {
//                     connect: { id: filer.id },
//                 },
//                 agency: {
//                     connect: { id: agency.id },
//                 },
//             },
//         })
//     } catch (e) {
//         if (e.code === "P2002") {
//             // uniqueness constraint failed, transaction already added
//             return
//         }

//         console.error(e)
//         debugger
//     }

//     console.log(`Saved independent expenditure ${paymentId}`)

//     /*

//     transactionId
//     date
//     amount
//     description
//     position
//     ballotMeasureName
//     ballotMeasureNumber
//     candidateFirstName
//     candidateLastName
//     officeCode
//     officeDescription
//     jurisdiction
//     reportNumber
//     reportIdNumber
//     reportDate
//     reportFromDate
//     reportThruDate

//     */

// }


function coerceScheduleA(contribution) {
    const {
        A: fppcId,
        B: filerName,
        C: reportNumber,
        D: committeeType,
        E: reportDate,
        F: reportFromDate,
        G: reportThruDate,
        M: transactionId,
        N: contributorType,
        AB: date,
        AD: amount,
        AF: description,
        AG: contributorCommitteeId,
        O: contributorLastName,
        P: contributorFirstName,
        // Q: contributorPrefix,
        // R: contributorSuffix,
        S: contributorAddress1,
        T: contributorAddress2,
        U: contributorCity,
        V: contributorState,
        W: contributorZip,
        Y: contributorOccupation,
        X: contributorEmployer,
        Z: contributorSelfEmployed,
    } = contribution

    return {
        fppcId: fppcId.replace('#', '').replace('SCO', ''),
        filerName,
        committeeType,
        transactionId,
        date: formatDate(date),
        amount,
        description,
        contributorType: entityTypeMapping[contributorType],
        contributorCommitteeId,
        contributorLastName: normalizeContributorLastName(contributorLastName),
        contributorFirstName,
        contributorAddress1,
        contributorAddress2,
        contributorCity,
        contributorState,
        contributorZip: contributorZip.replace(/-$/, ""),
        contributorOccupation,
        contributorEmployer,
        contributorSelfEmployed: contributorSelfEmployed === "y",
        reportNumber: +reportNumber,
        reportDate: formatDate(reportDate),
        reportFromDate: formatDate(reportFromDate),
        reportThruDate: formatDate(reportThruDate),
    }
}


export default async function loadNetfile({ agencyName, agencyId, year }) {
    const excelFile = `./tmp/efile_newest_${agencyId}_${year}.xlsx`

    const sheets = [{
            sheet: 'A-Contributions',
            file: 'schedule-a',
            coerce: coerceScheduleA
        },
        {
            sheet: 'C-Contributions',
            file: 'schedule-c',
            coerce: coerceScheduleC,
        },
        {
            sheet: 'E-Expenditure',
            file: 'schedule-e',
        },
        {
            sheet: '496',
            file: 'independent-expenditures'
        }
    ]

    const data = excelToJson({
        sourceFile: excelFile,
        header: {
            rows: 1,
        },
        sheets: sheets.map(s => s.sheet)
    })

    const q = new Queue({ concurrency: 1 })

    sheets.forEach(s => {
        q.add(async() => {
            const { coerce, sheet, file } = s
            const rows = data[sheet]
            if (!coerce) return
            const coerced = rows.map((d, i) => {
                const c = coerce(d)
                const {
                    fppcId,
                    reportNumber,
                    reportDate,
                    transactionId,
                } = c

                const id = getTransactionId({
                    fppcId,
                    reportNumber,
                    reportDate,
                    transactionId,
                    agencyId,
                })

                return {
                    id,
                    year,
                    agencyName,
                    agencyId,
                    ...c,
                }
            })
            const path = `./data/${file}-${year}.json`
            let toKeep = []

            try {
                const f = await fs.readFile(path)
                toKeep = JSON.parse(f.toString())
            } catch (e) {
                if (e.code !== 'ENOENT') {
                    console.log(e)
                }
            }

            const toAdd = coerced.filter(d => {
                const match = toKeep.find(dd => dd.id === d.id)
                if (match) return false
                return true
            })
            const toKeepAndCoerced = [
                ...toKeep,
                ...toAdd,
            ]
            const uniqById = _.uniqBy(toKeepAndCoerced, d => d.id)
            const sorted = _.sortBy(uniqById, ['year', 'agencyId', 'fppcId', 'id'])
            await fs.writeFile(path, JSON.stringify(sorted, null, 2))
        })
    })

    await q.onIdle()
}
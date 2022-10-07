import { csvFormat } from 'd3-dsv'
import data from '$lib/data.json'

const rows = data.committees.map(committee => {
    const { name: candidate, office, district, measure, position, contributors } = committee
    const fppcId = committee['fppc id']

    return contributors.map(c => {
        const { contributor, contributorCity, contributorState, total } = c
        return {
            fppcId,
            candidate,
            office,
            district,
            measure,
            position,
            contributor: contributor.replace(/,/g, '\,'),
            contributorCity,
            contributorState,
            total
        }
    })
}).flat()

const cols = {
    'fppcId': 'FPPC ID',
    'candidate': 'Candidate',
    'office': 'Office',
    'district': 'District',
    'measure': 'Measure',
    'position': 'Position',
    'contributor': 'Contributor',
    'contributorCity': 'Contributor city',
    'contributorState': 'Contributor state',
    'total': 'Contributor total',
}

const transformed = rows.map(d => {
    const dd = {}
    Object.keys(cols).forEach(col => {
        const value = d[col]
        const newCol = cols[col]
        dd[newCol] = value
    })
    return dd
})
const csv = csvFormat(transformed)
const filename = `sac-contributions-${data.generated}.csv`

export async function get() {
    return {
        status: 200,
        headers: {
            'Content-disposition': `attachment; filename=${filename}`,
            'Content-Type': 'text/csv'
        },
        body: csv
    }
}
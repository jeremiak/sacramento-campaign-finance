import data from '$lib/data.json'

const rows = data.committees.map(committee => {
    const { name: candidate, office, district, contributors } = committee
    const fppcId = committee['fppc id']

    return contributors.map(c => {
        const { contributor, contributorCity, contributorState, total } = c
        return {
            fppcId,
            candidate,
            office,
            district,
            contributor: contributor.replace(/,/g, '\,'),
            contributorCity,
            contributorState,
            total
        }
    })
}).flat()

const cols = [
    ['fppcId', 'FPPC ID', ],
    ['candidate', 'Candidate', ],
    ['office', 'Office', ],
    ['district', 'District', ],
    ['contributor', 'Contributor', ],
    ['contributorCity', 'Contributor city', ],
    ['contributorState', 'Contributor state', ],
    ['total', 'Contributor total'],
]
const csv = `${cols.map(c => c[1]).join(',')}\n${rows.map(r => {
  const row = cols.map((c, i) => {
    const value = r[c[0]]

    if (value.includes && value.includes(',')) {
      return `"${value}"`
    } else {
      return value
    }
  }).join(',')
  return row
}).join('\n')}`
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
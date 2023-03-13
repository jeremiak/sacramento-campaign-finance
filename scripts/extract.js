import exec from './exec.js'

export default async function extract({ agencyId, year }) {
    const zipFile = `${year}_${agencyId}.zip`
    const cmd = `unzip -o -u tmp/${zipFile} -d tmp`
    return exec(cmd)
}
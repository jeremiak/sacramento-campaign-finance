import { csvFormat } from 'd3-dsv'
import { error } from '@sveltejs/kit'
import sacCity from '$lib/data-sac-city.json'

export function GET({ params }) {
    const { bodyId } = params

    if (bodyId !== 'sac-city') throw new error(404)

    const rows = sacCity.data.map(d => {
        const { name, title, contributors } = d
        return contributors.map(c => {
            return { politician: name, title, ...c }
        })
    }).flat()
    const csv = csvFormat(rows)
    return new Response(csv)
}
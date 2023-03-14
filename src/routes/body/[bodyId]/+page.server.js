import { error } from '@sveltejs/kit';
import sacCity from '$lib/data-sac-city.json'
import sacCounty from '$lib/data-sac-county.json'

export async function load({ params }) {
    const { bodyId } = params

    let data, generated

    if (bodyId === 'sac-city') {
        data = sacCity.data
        generated = sacCity.generated
    } else if (bodyId === 'sac-county') {
        data = sacCounty.data
        generated = sacCounty.generated
    } else {
        throw error(404)
    }

    return {
        bodyId,
        generated,
        legislators: data
    }
}
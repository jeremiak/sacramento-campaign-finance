import { error } from '@sveltejs/kit';
import sacCity from '$lib/data-sac-city.json'

export async function load({ params }) {
    const { bodyId } = params
    if (bodyId !== 'sac-city') throw error(404)

    const { data, generated } = sacCity

    return {
        bodyId,
        generated,
        legislators: data
    }
}
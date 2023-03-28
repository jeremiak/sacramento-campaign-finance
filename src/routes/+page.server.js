import { sum } from 'd3-array'
import sacCity from '$lib/data-sac-city.json'
import sacCounty from '$lib/data-sac-county.json'

function totalInDataset(dataset) {
    const total = sum(dataset, d => {
        return sum(d.contributors, dd => dd.amount)
    })

    return total
}

export function load() {
    const sacCityTotal = totalInDataset(sacCity.data)
    const sacCountyTotal = totalInDataset(sacCounty.data)

    return {
        sacCityTotal,
        sacCountyTotal,
    }
}
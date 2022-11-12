import { committees, generated } from "$lib/data.json";

function createRaceKey(committee) {
    const { office, district, measure, position } = committee;
    let raceKey = null;

    if (measure) {
        raceKey = `Measure ${measure}`;
    } else if (district === "") {
        raceKey = office;
    } else {
        raceKey = `${office} ${district}`;
    }

    return raceKey;
}

function formatGeneratedAt(generatedAt) {
    const d = new Date(generatedAt);
    const dateGeneratedAt = d.toLocaleString(undefined, {
        hour: "numeric",
        minute: "numeric",
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "America/Los_Angeles"
    });
    return dateGeneratedAt;
}

export async function load() {
    const races = {};
    committees.forEach((committee) => {
        const raceKey = createRaceKey(committee);

        if (races[raceKey]) {
            races[raceKey].push(committee);
        } else {
            races[raceKey] = [committee];
        }
    });

    const array = [];
    Object.keys(races).forEach((raceKey) => {
        const committees = races[raceKey];
        const race = {
            race: raceKey,
            committees,
        };

        if (raceKey.includes("Measure")) {
            const supporters = committees.filter((d) => d.position === "Support");
            const opponents = committees.filter((d) => d.position === "Oppose");

            race.committees = [{
                    "fppc id": "",
                    name: "Support",
                    total: supporters.reduce((accum, next) => accum + next.total, 0),
                    contributors: supporters
                        .map((d) => d.contributors)
                        .flat()
                        .sort((a, b) => b.amount - a.amount),
                    ie: supporters.map((d) => d.ie).flat(),
                },
                {
                    "fppc id": "",
                    name: "Oppose",
                    total: opponents.reduce((accum, next) => accum + next.total, 0),
                    contributors: opponents
                        .map((d) => d.contributors)
                        .flat()
                        .sort((a, b) => b.amount - a.amount),
                    ie: opponents.map((d) => d.ie).flat(),
                },
            ];
        }

        array.push(race);
    });

    return {
        dateGeneratedAt: formatGeneratedAt(generated),
        races: array,
    };
}

export const prerender = true;
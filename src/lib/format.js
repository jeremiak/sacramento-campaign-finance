export function formatDollar(number) {
    const floor = Math.floor(number)
    return `$${floor.toLocaleString('en-US')}`
}
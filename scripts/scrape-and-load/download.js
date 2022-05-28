import path from "path"
import { fileURLToPath } from "url"

import puppeteer from "puppeteer"

const __filename = fileURLToPath(
    import.meta.url)
const __dirname = path.dirname(__filename)
const downloadPath = path.join(__dirname, "../../tmp")

export default async function downloadNetfile({ agencyId, year }) {
    const downloadPageUrl = `https://public.netfile.com/pub2/Default.aspx?aid=${agencyId}`
    const browser = await puppeteer.launch({ headless: true, timeout: 60000 })
    const page = await browser.newPage()

    try {
        console.log('b', agencyId)
        await page.goto(downloadPageUrl, { timeout: 60000 })

        if (page.url() !== downloadPageUrl) {
            console.log('bb')
            await page.goto(downloadPageUrl, { timeout: 60000 })
        }

        console.log('c', agencyId)

        await page._client.send("Page.setDownloadBehavior", {
            behavior: "allow",
            downloadPath,
        })

        console.log('d', agencyId)

        await page.waitForSelector("#ctl00_phBody_DateSelect")
        console.log('e', agencyId)
        await page.select("#ctl00_phBody_DateSelect", year)
        console.log('f', agencyId)
        await page.click("#ctl00_phBody_GetExcel")
        console.log('g', agencyId)

        // instead of trying to figure out if the file is done
        // downloading, let's just wait 5 seconds and see if
        // that works for now. shrug
        // const fileName = `${aid}-${year}.zip`
        await page.waitForTimeout(7000)
        console.log('h', agencyId)
        await browser.close()
        return
    } catch (e) {
        console.error(`ERR`, e)
    }
}
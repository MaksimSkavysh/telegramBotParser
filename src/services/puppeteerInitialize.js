const puppeteer = require('puppeteer')
const { PUPPETEER_HEADLESS } = require('../constants/config')

const init = async () => {
  const browser = await puppeteer.launch({ headless: PUPPETEER_HEADLESS })
  const page = await browser.newPage()
  await page.setViewport({ width: 1366, height: 768 })
  const actions = {
    typeInput: async (selectorPath, value) => {
      await page.$eval(selectorPath, (el, value) => el.value = value, value)
    },
    wait: (t = 5000) => new Promise((resolve) => setTimeout(resolve, t)),
    click: async (selector, { timeout = 3000 } = {}) => {
      await page.waitForSelector(selector, { timeout })
      await page.click(selector)
    },
    scrollIntoView: selector => page.$eval(selector, el => el.scrollIntoView()),
    close: () => browser.close(),
    $: page.$,
    getText: async (selector, errors) => {
      await page.waitForSelector(selector, { timeout: 3000 })
      return await page.$eval(selector, el => el.textContent)
        .catch((e) => {
          if (!errors) {
            throw e
          } else {
            Array.isArray(errors) && errors.push(e)
          }
        })
    },
  }
  return { page, browser, actions }
}

module.exports = init

require('dotenv').config()
const config = require('./config.json')
const { TELEGRAM_BOT_TOKEN, USER_ID } = require('./src/constants/config')
const { loadSavedData, saveNewData } = require('./src/services/storage')
const { TelegramBot } = require('./src/services/telegram')
const initializeBrowser = require('./src/services/puppeteerInitialize')
const otodom = require('./src/services/otodom')
const { getMessageText, getErrorMessage, getWarningMessage } = require('./src/utils')

const MyTelegramBot = new TelegramBot(TELEGRAM_BOT_TOKEN, USER_ID)

const parse = async (browser, parser, savedData) => {
  const { data: newData, errors } = await parser.parse(browser, ({ link }) => !savedData?.links?.[link])
  await MyTelegramBot.sendMessages(newData.map(getMessageText))
  if (errors && errors.length) {
    const warnMessage = getWarningMessage(errors)
    await MyTelegramBot.sendOneMessage(warnMessage)
  }
  await saveNewData(savedData, newData)
}

const main = async () => {
  let browser
  try {
    console.log('\n', (new Date()).toLocaleDateString('ru', { hour: 'numeric', minute: 'numeric' }))
    const savedData = await loadSavedData()
    browser = await initializeBrowser()
    await parse(browser, otodom, savedData)
    await browser.browser.close()
  } catch (e) {
    await MyTelegramBot.sendOneMessage(getErrorMessage(e))
    await browser?.browser?.close()
    throw e
  }
  setTimeout(main, config.rerunTime)
}

main()

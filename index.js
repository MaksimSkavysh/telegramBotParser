require('dotenv').config()
const { TELEGRAM_BOT_TOKEN, USER_ID, TIMEOUT } = require('./src/constants/config')
const { loadSavedData, saveNewData, loadUsers, saveUsers } = require('./src/services/storage')
const { TelegramBot } = require('./src/services/telegram')
const initializeBrowser = require('./src/services/puppeteerInitialize')
const otodom = require('./src/services/otodom')
const { getMessageText, getErrorMessage, getWarningMessage, formatTextForMarkdown } = require('./src/utils/utils')

const parse = async (browser, parser, file) => {
  const savedData = await loadSavedData(file, { links: [] })
  const { data, errors } = await parser.parse(browser, ({ link }) => !savedData?.links?.[link])
  await MyTelegramBot.sendMessages(data.map(getMessageText))
  if (errors && errors.length) {
    const warnMessage = getWarningMessage(errors)
    await MyTelegramBot.sendOneMessage(warnMessage)
  }
  const newData = {
    links: {
      ...savedData.links,
      ...data.reduce((acc, item) => {
        acc[item.link] = true
        return acc
      }, {}),
    },
  }
  await saveNewData(file, newData)
}

const MyTelegramBot = new TelegramBot(TELEGRAM_BOT_TOKEN, USER_ID, saveUsers)

let restartAttempts = 0
const RESTARTS_LIMIT = 3
const main = async () => {
  let browser
  try {
    console.log('\n', (new Date()).toLocaleDateString('ru', { hour: 'numeric', minute: 'numeric' }))
    const users = await loadUsers()
    MyTelegramBot.setSecondaryUsers(users)
    browser = await initializeBrowser()
    await parse(browser, otodom, 'otodomLinks.json')
    await browser.browser.close()
    restartAttempts = 0
  } catch (e) {
    restartAttempts++
    await MyTelegramBot.sendOneMessage(getErrorMessage(e))
    await browser?.browser?.close()
    if (restartAttempts > RESTARTS_LIMIT) {
      throw e
    }
    const message = formatTextForMarkdown(`Service restarted, attempt ${1} of ${RESTARTS_LIMIT}...`)
    await MyTelegramBot.sendOneMessage(message)
  }
  setTimeout(main, TIMEOUT)
}

main()

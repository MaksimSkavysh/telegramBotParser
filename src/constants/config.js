const path = require('node:path')

const getEnv = (key, defaultValue) => {
  if (defaultValue !== undefined) {
    return process.env[key] || defaultValue
  } else {
    const value = process.env[key]
    if (!value) {
      throw new Error('Missed required ENVs')
    }
    return value
  }
}

module.exports = {
  TELEGRAM_BOT_TOKEN: getEnv('TELEGRAM_BOT_TOKEN'),
  USER_ID: getEnv('USER_ID'),
  BACKUP_FOLDER: getEnv('TELEGRAM_BOT_TOKEN', './data'),
  TIMEOUT: getEnv('TIMEOUT', (10 * 60 * 1000)),
  PUPPETEER_HEADLESS: getEnv('PUPPETEER_HEADLESS', true),
  FILE_PATH: path.join(process.cwd(), 'data', 'usedLinksData.json'),
  PASSWORD: '1223',
}

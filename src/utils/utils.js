const escapeSpecialCharacters = (text) => (text || '').replace(/[*[\]()~`>#+-=|{}.!\\]/g, '\\$&')

const getMessageText = (data) => {
  const { link, phone, hostName, price, address, publishingDateInfo } = data
  return `🏠
*Link:* ${escapeSpecialCharacters(link)}
*Address:* ${escapeSpecialCharacters(address)}
*Price:*${escapeSpecialCharacters(price)}
*Host name:* ${escapeSpecialCharacters(hostName)}
*Published:* ${escapeSpecialCharacters(publishingDateInfo)}
`
}

const getErrorMessage = (...errors) => `🔴*ERROR IN SERVICE*❗🔴
${errors.map(e => `*Error*: ${escapeSpecialCharacters(e.toString())}
`).join('\n')}
`

const getWarningMessage = (...errors) => `⚠️*WARNINGS IN SERVICE*⚠️
${errors.map(e => `*Warn*: ${escapeSpecialCharacters(e.toString())}
`).join('\n')}
`

module.exports = {
  getMessageText,
  formatTextForMarkdown: escapeSpecialCharacters,
  getErrorMessage,
  getWarningMessage,
}

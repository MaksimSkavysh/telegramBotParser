const formatTextForMarkdownV2 = (text) => (text || '').replace(/[*[\]()~`>#+-=|{}.!\\]/g, '\\$&')

const getMessageText = (data) => {
  const { link, phone, hostName, price, address, publishingDateInfo } = data
  return `🏠
*Link:* ${formatTextForMarkdownV2(link)}
*Address:* ${formatTextForMarkdownV2(address)}
*Price:*${formatTextForMarkdownV2(price)}
*Phone:* ${formatTextForMarkdownV2(phone)}
*Host name:* ${formatTextForMarkdownV2(hostName)}
*Published:* ${formatTextForMarkdownV2(publishingDateInfo)}
`
}

const getErrorMessage = (...errors) => `🔴*ERROR IN SERVICE*❗🔴
${errors.map(e => `*Error*: ${formatTextForMarkdownV2(e.toString())}`).join('\n')}
`

const getWarningMessage = (...errors) => `⚠️*WARNINGS IN SERVICE*❗⚠️
${errors.map(e => `*Error*: ${formatTextForMarkdownV2(e.toString())}`).join('\n')}
`

module.exports = {
  getMessageText,
  formatTextForMarkdownV2,
  getErrorMessage,
  getWarningMessage,
}

const { Telegraf } = require('telegraf')

class TelegramBot {
  constructor (token, userId) {
    this.bot = new Telegraf(token)
    this.bot.launch()
    this.userId = userId
  }

  async sendOneMessage (message) {
    if (!message || Object.keys(message).length === 0) {
      console.error('Message: ', message)
      throw new Error('Empty message not allowed')
    }
    await this.bot.telegram.sendMessage(
      this.userId,
      message,
      { parse_mode: 'MarkdownV2' },
    )
  }

  async sendMessages (messages) {
    if (messages.length === 0) {
      // eslint-disable-next-line no-console
      console.log('No updates')
      return
    }
    // eslint-disable-next-line no-console
    console.log('sending updates to telegram...')
    for (const message of messages) {
      await this.sendOneMessage(message)
    }
    // eslint-disable-next-line no-console
    console.log(`${messages.length} messages was sent to telegram`)
  }
}

module.exports = {
  TelegramBot,
}

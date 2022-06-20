const { Telegraf } = require('telegraf')
const { PASSWORD } = require('../constants/config')

class TelegramBot {
  constructor (token, userId, saveUsers) {
    const bot = new Telegraf(token)
    this.bot = bot
    this.bot.launch()
    this.userId = userId
    this.saveUsers = saveUsers
    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))
    this.secondaryUsers = {}
    const pendingUsers = {}
    bot.command('start', (ctx) => {
      const user = ctx.update.message.from
      if (user.id !== this.userId && !this.secondaryUsers[user.id]) {
        pendingUsers[user.id] = true
        ctx.reply(`Hello ${user.first_name}, please send password`)
      }
    })
    bot.on('message', (ctx) => {
      const message = ctx.update.message
      if (pendingUsers[message.from.id]) {
        if (message.text === PASSWORD) {
          this.addSecondaryUser(message.from.id)
          delete pendingUsers[message.from.id]
          ctx.reply(`Password confirmed`)
          return
        }
        ctx.reply(`Password incorrect, please try again`)
      }
    })
  }

  setSecondaryUsers = (users) => {
    this.secondaryUsers = users
  }

  addSecondaryUser = (userId) => {
    this.secondaryUsers[userId] = true
    this.saveUsers(this.secondaryUsers)
  }

  async _sendToAllUsers (message) {
    await this.bot.telegram.sendMessage(this.userId, message, { parse_mode: 'MarkdownV2' })
    try {
      Object.entries(this.secondaryUsers)
        .filter(([id, value]) => value && id !== this.userId)
        .forEach(([id]) => {
          this.bot.telegram.sendMessage(id, message, { parse_mode: 'MarkdownV2' })
        })
    } catch (e) {
      console.error(e)
    }
  }

  async sendOneMessage (message) {
    if (!message || Object.keys(message).length === 0) {
      console.error('Message: ', message)
      throw new Error('Empty message not allowed')
    }
    await this._sendToAllUsers(message)
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

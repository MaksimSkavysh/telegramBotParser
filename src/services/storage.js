const fs = require('node:fs')

const { FILE_PATH } = require('../constants/config')
const path = require('path')

const loadSavedData = async () => {
  if (fs.existsSync(FILE_PATH)) {
    return JSON.parse(fs.readFileSync(FILE_PATH, { encoding: 'utf-8' }))
  }
  return { links: [] }
}

const saveNewData = async (savedData, data) => {
  const newData = data.filter(item => !savedData.links[item.link])
  const newBackup = {
    links: {
      ...savedData.links,
      ...newData.reduce((acc, item) => {
        acc[item.link] = true
        return acc
      }, {}),
    },
  }
  fs.writeFileSync(FILE_PATH, JSON.stringify(newBackup, undefined, 2))
  console.log('Backup was saved successfully')
  return newData
}

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json')
const loadUsers = async () => {
  if (fs.existsSync(USERS_FILE)) {
    return JSON.parse(fs.readFileSync(USERS_FILE, { encoding: 'utf-8' }))
  }
  return {}
}
const saveUsers = async (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, undefined, 2))
}

module.exports = {
  loadSavedData,
  saveNewData,
  loadUsers,
  saveUsers,
}

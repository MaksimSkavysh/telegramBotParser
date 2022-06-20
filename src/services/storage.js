const fs = require('node:fs')

const { STORAGE_PATH } = require('../constants/config')
const path = require('path')

const loadSavedData = async (file, defaultValue) => {
  const filePath = path.join(STORAGE_PATH, file)
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, { encoding: 'utf-8' }))
  }
  return defaultValue
}

const saveNewData = async (file, data) => {
  const filePath = path.join(STORAGE_PATH, file)
  fs.writeFileSync(filePath, JSON.stringify(data, undefined, 2))
  console.log('Backup was saved successfully to', file)
}

const USERS_FILE = path.join(STORAGE_PATH, 'users.json')
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

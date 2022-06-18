const fs = require('node:fs')

const { FILE_PATH } = require('../constants/config')

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

module.exports = {
  loadSavedData,
  saveNewData,
}

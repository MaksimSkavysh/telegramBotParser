
const MORIZON_URL = 'https://www.morizon.pl/do-wynajecia/mieszkania/najnowsze/krakow/' +
  '?ps%5Bprice_to%5D=5000' +
  '&ps%5Bliving_area_from%5D=40' +
  '&ps%5Bnumber_of_rooms_from%5D=3'

const PAGES_TIMEOUT = 200

exports.parse = async ({ actions, page }, filter) => {
  await page.goto(MORIZON_URL)
  await actions.click('.cmp-button_button.cmp-intro_acceptAll ')
  // await actions.scrollIntoView('[data-cy="search.listing"]:nth-child(2)')
  const links = await page.$$eval('.property_link.property-url', (nodes) => {
    return nodes.map(el => el.href)
  })
  if (!links || !(links.length > 0)) {
    throw new Error('Links not found')
  }
  const data = []
  const errors = []
  for (const link of links) {
    if (filter({ link })) {
      await page.goto(link)
      const hostName = await actions.getText('.ownerInformationData [class="agentName"]', errors)
      const price = await actions.getText('li.paramIconPrice em', errors)
      // const added = await actions.getText('#propertyDetails section.propertyParams tr:nth-child(10) > td', [])
      // const updated = await actions.getText('#propertyDetails section.propertyParams tr:nth-child(9) > td', [])
      const address = await actions.getText('.summaryTop > .summaryLocation strong', [])
      data.push({
        link,
        id: link,
        price,
        hostName,
        address,
        publishingDateInfo: '',
      })
      await new Promise(resolve => setTimeout(resolve, PAGES_TIMEOUT))
    }
  }
  return { data, errors }
}

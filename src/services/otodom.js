
const OTODOM_URL = 'https://www.otodom.pl/pl/oferty/wynajem/mieszkanie/wiele-lokalizacji?' +
  'distanceRadius=0' +
  '&page=1' +
  '&limit=36' +
  '&market=ALL' +
  '&ownerTypeSingleSelect=ALL' +
  '&priceMax=3500' +
  '&locations=%5Bdistricts_6-39%2Cdistricts_6-40%2Cdistricts_6-300414%2Cdistricts_6-117%5D' +
  '&by=DEFAULT' +
  '&direction=DESC&viewType=listing'



const PAGES_TIMEOUT = 200

exports.parse = async ({ actions, page }, filter) => {
  await page.goto(OTODOM_URL)
  await actions.click('#onetrust-accept-btn-handler')
  await actions.scrollIntoView('[data-cy="search.listing.organic"]')
  const links = await page.$$eval('[data-cy="listing-item-link"]', (nodes) => {
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
      const added = await actions.getText('[class="css-atkgr euuef471"]', errors)
      const updated = await actions.getText('[class="css-wlnxoe euuef470"]', errors)
      const hostName = await actions.getText('[class="css-1yijy9r ezb2r8u5"]', errors)
      const hostType = await actions.getText('[class="css-1rl7r8w ezb2r8u2"]', errors)
      data.push({
        link,
        id: link,
        price: await actions.getText('[data-cy="adPageHeaderPrice"]', errors),
        hostName: `${hostName}; ${hostType}`,
        address: await actions.getText('[aria-label="Adres"]', errors),
        publishingDateInfo: `${added}; ${updated}`,
      })
      await new Promise(resolve => setTimeout(resolve, PAGES_TIMEOUT))
    }
  }
  return { data, errors }
}

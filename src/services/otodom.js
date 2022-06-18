
const OTODOM_URL = 'https://www.otodom.pl/pl/oferty/wynajem/mieszkanie/krakow' +
  '?distanceRadius=0' +
  '&page=1' +
  '&limit=36' +
  '&market=ALL' +
  '&priceMax=5000' +
  '&roomsNumber=%5BTHREE%5D' +
  '&heating=%5BURBAN%5D' +
  '&locations=%5Bcities_6-38%5D' +
  '&priceMin=2000' +
  '&areaMin=45' +
  '&viewType=listing'

exports.parse = async ({ actions, page }, filter) => {
  await page.goto(OTODOM_URL)
  await actions.click('#onetrust-accept-btn-handler')
  await actions.scrollIntoView('[data-cy="search.listing"]:nth-child(2)')
  const links = await page.$$eval('[data-cy="search.listing"]:nth-child(2) [data-cy="listing-item-link"]', (nodes) => {
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
      const updated = await actions.getText('[class="css-zojvsz euuef470"]', errors)
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
    }
  }
  return { data, errors }
}

import Browser from 'puppeteer'
import fs from 'fs'
import { v4 } from 'uuid'

(async()=>{
  console.log(Browser)
  const start = new Date()
  const client = await Browser.launch({
    headless: true
  });

  const page = await client.newPage()

  await page.goto('https://ncov.dxy.cn/ncovh5/view/pneumonia');
  const fields = [
    'apierror',
    'fetchGoodsGuide',
    'fetchRecentStat',
    'fetchRecentStatV2',
    'fetchWHOArticle',
    'getAreaStat',
    'getEntries',
    'getIndexRecommendList2',
    'getPV',
    'getStatisticsService',
    'getTimelineService1',
    'getTimelineService2',
    'getWikiList',
  ]
  await Promise.all(
    fields.map(k => page.waitForSelector('#' + k))
  );
  const v = await page.evaluate(`({
    ${fields.map(k => `${k}: window["${k}"],`).join('\n')}
  })`)
  await client.close()
  const s = JSON.stringify(v, null, 2);

  // fs.writeFileSync(`./results/ncov-result-${Date.now()}.json`, s)
  fs.writeFileSync(`./results/ncov-result-latest.json`, s)
  
  const f = []
  for (let i = 0; i < 200000; i += 1) {
    f.push(v4())
  }

  fs.writeFileSync('./.tags', f.join('\n'))
})()
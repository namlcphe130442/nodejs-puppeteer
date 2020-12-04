const express = require('express')
const puppeteer = require('puppeteer')
const app = express()
const port = 3000

const dataAll = async () =>{
  
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://ncov.moh.gov.vn/')

    const data = await page.evaluate(() => {
      let td = document.querySelector('.box-tke-V3 .box-vn');
      let result = td.textContent;
      return result;
    });
    await browser.close();
    return data;
}

app.get('/', async (req, res) => {
  const data = await dataAll()
  res.status(200).json({
    name: data
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
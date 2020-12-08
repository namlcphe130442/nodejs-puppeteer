const express = require('express')
const puppeteer = require('puppeteer')
const app = express()
const port = 3000

const tableCase = async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage()
  await page.goto('https://ncov.moh.gov.vn/')
  const dataTable = await page.$$eval('#sailorTable tbody tr', rows => {
    const list = [];
    rows.forEach(row => {
      const columns = row.querySelectorAll('td');
      const element = {
        key: columns[0].innerText,
        patient: columns[0].innerText,
        age: columns[1].innerText,
        detectionPosition: columns[3].innerText,
        status: columns[4].innerText,
        nationality: columns[5].innerText
      };
      list.push(element);
    });
    return list;
  });
  await browser.close();
  return dataTable;
}

const developCase = async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage()
  await page.goto('https://ncov.moh.gov.vn/dong-thoi-gian')
  const dataTable = await page.$$eval('.timeline-sec', times => {
    const list = [];
    times.forEach(time => {
      const columns = time.querySelectorAll('ul');
      columns.forEach(column => {
        const head = column.querySelector('.timeline-head h3').innerText;
        const content = column.querySelector('.timeline-content').innerText.split('\n');
        const contentArray = [];
        content.forEach(element => {
          contentArray.push(element.trim());
        });
        const timeline = {
          head: head,
          content: contentArray.filter(word => word.length > 0)
        }
        list.push(timeline);
      });
      // list.push(columns[1].innerText);
    });
    return list;
  });
  await browser.close();
  return dataTable;
}

app.get('/', async (req, res) => {
  const dataTableCase = await tableCase();
  const dataDevelopCase = await developCase()
  res.status(200).json({
    dataDevelopCase,
    dataTableCase
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
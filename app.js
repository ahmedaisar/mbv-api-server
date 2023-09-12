// app.js
const express = require('express');
const app = express();
const chrome = require('chrome-aws-lambda');
//const puppeteer = require('puppeteer-core');

app.get('/api', async (req, res) => {
  let query = req.query;
  const { hotelid, checkin, checkout } = query;
  const browserFetcher = chrome.puppeteer.createBrowserFetcher();
  const revisionInfo = await browserFetcher.download("809590");
  console.log(revisionInfo)

  const options = {
    args: chrome.args,
    defaultViewport: chrome.defaultViewport,
    executablePath: revisionInfo.executablePath,
    headless: chrome.headless,
  };

  try {

    
    const browser = await chrome.puppeteer.launch(options);

    const page = await browser.newPage();

    await page.goto(
      `https://hotelscan.com/combiner/${hotelid}?pos=zz&locale=en&checkin=${checkin}&checkout=${checkout}&rooms=2&mobile=0&loop=1&country=MV&ef=1&geoid=xmmmamtksdxx&toas=resort&availability=1&deviceNetwork=4g&deviceCpu=20&deviceMemory=8&limit=25&offset=0`,
      {
        waitUntil: "networkidle2",
      }
    );
    // let html = await page.evaluate(() => {
    //   return JSON.parse(document.querySelector("body").innerText);
    // });
    let body = await page.waitForSelector('body');
    let json = await body?.evaluate(el => el.textContent);
    await page.waitForTimeout(1000);    
    await browser.close();
    res.status(200).json(json);
  } catch (error) {
    console.log(error);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}.`));

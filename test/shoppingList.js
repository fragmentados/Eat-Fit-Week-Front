const puppeteer = require('puppeteer');
function delay(time) {
  return new Promise(function(resolve) {
      setTimeout(resolve, time)
  });
}
async function main() {
const browser = await puppeteer.launch({ignoreHTTPSErrors: true, headless: false});
const page = await browser.newPage();
await page.setViewport({width: 1200, height: 720})
await page.goto('https://localhost:4200/users/login', { waitUntil: 'networkidle0' }); // wait until page load
await page.type('#email', 'test@mail.com');
await page.type('#password', '1234');
// click and wait for navigation
await Promise.all([
          page.click('#loginButton'),
          page.waitForNavigation({ waitUntil: 'networkidle0' })
]);
await delay(1000);
page.click('#shoppingListButton');
await delay(1000);
await page.screenshot({path: 'shoppingList.png'});
}

main();

/* global document */
import test from 'ava';
import spaceshow from './dist';

let page;
test.before(async () => {
  page = await spaceshow({
    appDir: `${__dirname}/meteor-test-app`,
    port: 3100,
    puppeteerOptions: { args: ['--no-sandbox', '--disable-setuid-sandbox'] },
  });
});

test('start meteor app', async (t) => {
  await page.waitForSelector('h1');
  const html = await page.evaluate(() => document.querySelector('h1').innerHTML);
  t.is(html, 'Welcome to Meteor!');
});

test.after.always(async () => {
  await page.close();
});

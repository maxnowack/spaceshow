/* global document */
import spaceshow from './src';

(async () => {
  const page = await spaceshow({
    appDir: `${__dirname}/meteor-test-app`,
    port: 3100,
  });

  await page.waitForSelector('h1');
  const html = await page.evaluate(() => document.querySelector('h1').innerHTML);

  console.log(html);

  await page.close();
})();

process.on('unhandledRejection', (error) => {
  console.log('unhandledRejection', error);
});

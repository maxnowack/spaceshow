import MeteorApp from './MeteorApp';
import startPuppeteer from './startPuppeteer';

export default (options) => {
  const {
    args,
    appDir,
    settings,
    meteorPath,
    port = 3000,
    puppeteerOptions = {},
  } = options || {};

  if (!appDir) throw new Error('appDir not specified!');

  const meteorApp = new MeteorApp({
    args,
    appDir,
    port,
    settings,
    meteorPath,
  });

  return Promise.all([
    meteorApp.launch(),
    startPuppeteer(puppeteerOptions),
  ]).then(([meteor, puppeteer]) => {
    puppeteer.meteor = meteorApp; // eslint-disable-line no-param-reassign
    puppeteer.on('close', () => {
      meteor.kill();
    });

    return puppeteer.goto(`http://localhost:${port}`).then(() => puppeteer);
  });
};

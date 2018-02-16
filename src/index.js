import MeteorApp from './MeteorApp';
import startPuppeteer from './startPuppeteer';

export default async (options) => {
  const {
    appDir,
    settings,
    meteorPath,
    port = 3000,
    puppeteerOptions = {},
  } = options || {};

  if (!appDir) throw new Error('appDir not specified!');

  const meteorApp = new MeteorApp({
    appDir,
    port,
    settings,
    meteorPath,
  });

  const [meteor, puppeteer] = Promise.all([
    meteorApp.launch(),
    startPuppeteer(puppeteerOptions),
  ]);

  puppeteer.on('close', () => {
    meteor.exit();
  });

  await puppeteer.goto(`http://localhost:${port}`);

  return puppeteer;
};

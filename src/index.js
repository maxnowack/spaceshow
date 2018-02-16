import { EventEmitter } from 'events';
import MeteorApp from './MeteorApp';
import startPuppeteer from './startPuppeteer';

export class Spaceshow extends EventEmitter {
  constructor(options) {
    super();
    this.options = options;
    const {
      args,
      appDir,
      settings,
      meteorPath,
      port = 3000,
    } = options || {};

    if (!appDir) throw new Error('appDir not specified!');

    this.meteorApp = new MeteorApp({
      args,
      appDir,
      port,
      settings,
      meteorPath,
    });

    this.meteorApp.on('stdout', data => this.emit('stdout', data.toString()));
    this.meteorApp.on('stderr', data => this.emit('stderr', data.toString()));
  }

  start() {
    return Promise.all([
      this.meteorApp.launch(),
      startPuppeteer(this.options.puppeteerOptions),
    ]).then(([meteor, puppeteer]) => {
      puppeteer.meteor = this.meteorApp; // eslint-disable-line no-param-reassign
      puppeteer.on('close', () => {
        meteor.kill();
      });

      return puppeteer.goto(`http://localhost:${this.options.port || 3000}`).then(() => puppeteer);
    });
  }
}

export default (options) => {
  const show = new Spaceshow(options);
  return show.start();
};

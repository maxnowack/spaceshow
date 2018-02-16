import { EventEmitter } from 'events';
import puppeteer from 'puppeteer';

class PuppeteerWrapper extends EventEmitter {
  constructor(options) {
    super();
    this.options = options;
  }

  async init() {
    this.browser = await puppeteer.launch(this.options);
    this.page = await this.browser.newPage();

    // mirror page functions
    Object.keys(this.page.constructor.prototype).forEach((fnName) => {
      if (fnName === 'close') return;
      this[fnName] = this.page[fnName].bind(this.page);
    });
  }

  async close() {
    this.emit('close');
    await this.page.close();
    await this.browser.close();
  }
}

export default async (options) => {
  const wrapper = new PuppeteerWrapper(options);
  await wrapper.init();
  return wrapper;
};

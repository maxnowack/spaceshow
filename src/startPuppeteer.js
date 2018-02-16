import { EventEmitter } from 'events';
import puppeteer from 'puppeteer';

const pageFns = [
  '$',
  '$$',
  '$$eval',
  '$eval',
  '$x',
  'addScriptTag',
  'addStyleTag',
  'authenticate',
  'bringToFront',
  'click',
  'close',
  'content',
  'cookies',
  'coverage',
  'deleteCookie',
  'emulate',
  'emulateMedia',
  'evaluate',
  'evaluateHandle',
  'evaluateOnNewDocument',
  'exposeFunction',
  'focus',
  'frames',
  'goBack',
  'goForward',
  'goto',
  'hover',
  'keyboard',
  'mainFrame',
  'metrics',
  'mouse',
  'pdf',
  'queryObjects',
  'reload',
  'screenshot',
  'select',
  'setCacheEnabled',
  'setContent',
  'setCookie',
  'setDefaultNavigationTimeout',
  'setExtraHTTPHeaders',
  'setJavaScriptEnabled',
  'setOfflineMode',
  'setRequestInterception',
  'setUserAgent',
  'setViewport',
  'tap',
  'target',
  'title',
  'touchscreen',
  'tracing',
  'type',
  'url',
  'viewport',
  'waitFor',
  'waitForFunction',
  'waitForNavigation',
  'waitForSelector',
  'waitForXPath',
];

class PuppeteerWrapper extends EventEmitter {
  constructor(options) {
    super();
    this.options = options;
  }

  init() {
    return puppeteer.launch(this.options)
      .then((browser) => {
        this.browser = browser;
        return this.browser.newPage();
      })
      .then((page) => {
        this.page = page;

        // mirror page functions
        pageFns.forEach((fnName) => {
          if (fnName === 'close') return;
          if (typeof this.page[fnName] === 'function') {
            this[fnName] = this.page[fnName].bind(this.page);
          } else {
            this[fnName] = this.page[fnName];
          }
        });

        return this;
      });
  }

  close() {
    this.emit('close');
    return this.page.close().then(() => this.browser.close());
  }
}

export default (options) => {
  const wrapper = new PuppeteerWrapper(options);
  return wrapper.init();
};

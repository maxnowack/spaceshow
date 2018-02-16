# spaceshow [![Build Status](https://travis-ci.org/maxnowack/spaceshow.svg?branch=master)](https://travis-ci.org/maxnowack/spaceshow)
Wrapper for easily testing meteor apps with puppeteer

## Installation
````bash
  $ npm install --save spaceshow
````

## Usage
````javascript
  import spaceshow from 'spaceshow';

  const app = await spaceshow({
    appDir: `${__dirname}/meteor-test-app`, // path to your meteor app (required)
    port: 3000, // port to run your app. default to 3000
    settings: '…' // settings JSON string or file relative to app directory
    args: […], // custom args to pass to meteor command
    meteorPath: '…', // custom path for running meteor command
    puppeteerOptions: { … } // custom puppeteer options. see https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions
  });

  // for more commands see https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#class-page
  await page.waitForSelector('h1');
  const html = await page.evaluate(() => document.querySelector('h1').innerHTML);

  console.log(html);

  await page.close();
````

## License
Licensed under MIT license. Copyright (c) 2018 Max Nowack

## Contributions
Contributions are welcome. Please open issues and/or file Pull Requests.

## Maintainers
- Max Nowack ([maxnowack](https://github.com/maxnowack))

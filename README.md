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
    initialGotoOptions: { … } // options for initial goto call (setting a different timeout for example)
  });

  // for more commands see https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#class-page
  await page.waitForSelector('h1');
  const html = await page.evaluate(() => document.querySelector('h1').innerHTML);

  console.log(html);

  await page.close();
````

If you want more control over the whole process, you can also instantiate spaceshow by yourself
````javascript
  import { Spaceshow } from 'spaceshow';

  const show = new Spaceshow({
    // options like in the example above
  });

  // log meteor output
  show.on('stdout', (data) => {
    console.log(data);
  });
  show.on('stderr', (data) => {
    console.error(data);
  });

  const app = await show.start();

  // …
````

## License
Licensed under MIT license. Copyright (c) 2018 Max Nowack

## Contributions
Contributions are welcome. Please open issues and/or file Pull Requests.

## Maintainers
- Max Nowack ([maxnowack](https://github.com/maxnowack))

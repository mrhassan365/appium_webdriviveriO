const webdriverio = require('webdriverio');
const assert = require('chai').assert;
const expect = require('chai').expect;
const path = require('path');

describe('Basic IOS interactions', function () {
  
  let client;

  const app = path.resolve(__dirname, '..', '..', 'apps', 'TestApp.app.zip');

  before(async function () {
    client = await webdriverio.remote(Object.assign({
      capabilities: {
        platformName: 'iOS',
        automationName: 'XCUITest',
        deviceName: process.env.IOS_DEVICE_NAME || 'iPhone Xs',
        platformVersion: process.env.IOS_PLATFORM_VERSION || '12.4',
        app: app // Will be added in tests
      }},
      {
        host: process.env.APPIUM_HOST || 'localhost', port: process.env.APPIUM_PORT || 4723, logLevel: 'info'
      }
    ))
  });

  it('should send keys to inputs', async function () {
    const elementId = await client.findElement('accessibility id', 'TextField1');
    client.elementSendKeys(elementId.ELEMENT, 'Hello World!');

    const elementValue = await client.findElement('accessibility id', 'TextField1');
    await client.getElementAttribute(elementValue.ELEMENT, 'value').then((attr) => {
      assert.equal(attr, 'Hello World!');
    });
  });

  it('should click a button that opens an alert', async function () {
    const element = await client.findElement('accessibility id', 'show alert');
    await client.elementClick(element.ELEMENT);

    assert.equal(await client.getAlertText(), 'Cool title\nthis alert is so cool.');
  });

  after(async function () {
    await client.deleteSession();
  });

});

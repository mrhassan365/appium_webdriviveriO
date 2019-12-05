const webdriverio = require('webdriverio');
const assert = require('chai').assert;
const expect = require('chai').expect;
const path = require('path');

describe('E2E Test w. Permissions', function () {

  let driver;
  
  const DEFAULT_ANDROID_DEVICE_NAME = process.env.SAUCE
  ? 'Android GoogleAPI Emulator'
  : 'My Android Device';
  const DEFAULT_ANDROID_PLATFORM_VERSION = process.env.SAUCE ? '7.1' : null;
  
  const app = path.resolve(__dirname, '..', '..', 'apps', 'app-0.1.87.apk');

  before(async function () {
    
    driver = await webdriverio.remote(Object.assign({
      capabilities: {
        platformName: 'Android',
        automationName: 'UiAutomator2',
        build: 'webdriver-browserstack',
        deviceName: "Google Pixel",
        'browserstack.appium_version': '1.9.1',
        os_version: '7.1',
        appPackage: 'com.accuweather.app',
        appWaitActivity: 'com.accuweather.app.activities.MainActivity',
        fullReset: true,
        autoGrantPermissions: true,
        allowTestPackages: true,
        //platformVersion: process.env.ANDROID_PLATFORM_VERSION || DEFAULT_ANDROID_PLATFORM_VERSION,
        app: 'bs://1b5971d613f4092570df9e56ee75f767cf17c35d',
        'browserstack.debug': 'true',
        'browserstack.networkProfile': '4g-lte-advanced-good'
      }},
      {
        host: 'http://hub-cloud.browserstack.com/wd/hub', 
        logLevel: 'trace',
        user: 'carlhorned3',
        key: 'Sk5MoCs6UHtBppmu4ycs',
      }
    ));

    //await driver.execute('mobile: changePermissions', {action: "grant", appPackage: "com.accuweather.app", permissions: "android.permission.ACCESS_FINE_LOCATION"}); 
    //await driver.execute('mobile: getPermissions', {type: "granted", appPackage: "com.accuweather.app"}); 

  });

  it('should create a Session', async function () {

      //not needed on Browserstack

  });

  it('Check Landing Page', async function () {

    const selector = 'new UiSelector().resourceId("com.accuweather.app:id/header")';
    const landingText = await driver.$(`android=${selector}`);

    await landingText.waitForEnabled(10000);

    await expect(await landingText.getText()).to.equal("Today's Details")

  });

  it('Click Hourly', async function () {

    const selector = 'new UiSelector().resourceId("com.accuweather.app:id/hourly_forecast_fragment")';
    const hourly = await driver.$(`android=${selector}`);

    await hourly.waitForEnabled(3000);

    await hourly.touchAction('tap');

  });

  it('Check Weekday', async function () {

    const selector = 'new UiSelector().resourceId("com.accuweather.app:id/day_name_text")';
    const dayName = await driver.$(`android=${selector}`);

    await dayName.waitForEnabled(3000);

    await expect(await dayName.getText()).to.equal(getDayName());

  });

  it('Check Ad', async function () {

    /*const selector = 'new UiSelector().resourceId("com.accuweather.app:id/adLinearLayoutContainer").childSelector(new UiSelector().textMatches("Advertisement"))'
    const ad = await driver.$(`android=${selector}`);

    await ad.waitForEnabled(10000);

    await expect(await ad.getAttribute("clickable")).to.equal('true');*/

  });

  it('Click Daily', async function () {

    const selector = 'new UiSelector().resourceId("com.accuweather.app:id/daily_forecast_fragment")';
    const daily = await driver.$(`android=${selector}`);

    await daily.waitForEnabled(3000);

    await daily.touchAction('tap');

  });

  it('Check Month', async function () {

    const selector = 'new UiSelector().resourceId("com.accuweather.app:id/month_header").childSelector(new UiSelector().className("android.widget.TextView"))'
    const monthName = await driver.$(`android=${selector}`);

    await monthName.waitForEnabled(3000);

    await expect(await monthName.getText()).to.equal(getMonthName());

  });

  it('Click Radar', async function () {

    const selector = 'new UiSelector().resourceId("com.accuweather.app:id/radar_fragment")';
    const radar = await driver.$(`android=${selector}`);

    await radar.waitForEnabled(3000);

    await radar.touchAction('tap');

    //await driver.pause(300000)

  });

  after('should destroy a session', async function () {

    await driver.deleteSession();

  });

});

function getDayName(){

  var d = new Date()
  var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  return days[d.getDay()];

}

function getMonthName(){

  var m = new Date()
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  return months[m.getMonth()];

}

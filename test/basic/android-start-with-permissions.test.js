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
  
  const app = path.resolve(__dirname, '..', '..', 'apps', 'app-0.1.91.apk');

  before(async function () {
    
    driver = await webdriverio.remote(Object.assign({
      capabilities: {
        platformName: 'Android',
        automationName: 'UiAutomator2',
        deviceName: process.env.ANDROID_DEVICE_NAME || DEFAULT_ANDROID_DEVICE_NAME,
        appPackage: 'com.accuweather.app',
        appWaitActivity: 'com.accuweather.app.activities.MainActivity',
        fullReset: true,
        autoGrantPermissions: true,
        allowTestPackages: true,
        platformVersion: process.env.ANDROID_PLATFORM_VERSION || DEFAULT_ANDROID_PLATFORM_VERSION,
        app: app // Will be added in tests
      }},
      {
        host: process.env.APPIUM_HOST || 'localhost', port: process.env.APPIUM_PORT || 4723, logLevel: 'silent'
      }
    ));

    await driver.execute('mobile: changePermissions', {action: "grant", appPackage: "com.accuweather.app", permissions: "android.permission.ACCESS_FINE_LOCATION"}); 
    await driver.execute('mobile: getPermissions', {type: "granted", appPackage: "com.accuweather.app"}); 

  });

  it('should create a Session', async function () {

    const res = await driver.status();
    assert.isObject(res.build);

    const current_package = await driver.getCurrentPackage();
    assert.equal(current_package, 'com.accuweather.app');

  });

  it('Check Landing Page', async function () {

    const selector = 'new UiSelector().resourceId("com.accuweather.app:id/header")';
    const landingText = await driver.$(`android=${selector}`);

    landingText.waitForEnabled(3000);

    expect(await landingText.getText()).to.equal("Today's Details")

  });

  it('Click Hourly', async function () {

    const selector = 'new UiSelector().resourceId("com.accuweather.app:id/hourly_forecast_fragment")';
    const hourly = await driver.$(`android=${selector}`);

    hourly.waitForEnabled(3000);

    hourly.touchAction('tap');

  });

  it('Check Weekday', async function () {

    const selector = 'new UiSelector().resourceId("com.accuweather.app:id/day_name_text")';
    const dayName = await driver.$(`android=${selector}`);

    dayName.waitForEnabled(3000);

    expect(await dayName.getText()).to.equal(getDayName());

  });

  it('Check Ad', async function () {

    const selector = 'new UiSelector().resourceId("com.accuweather.app:id/adLinearLayoutContainer").childSelector(new UiSelector().textMatches("Advertisement"))'
    const ad = await driver.$(`android=${selector}`);

    ad.waitForEnabled(10000);

    expect(await ad.getAttribute("clickable")).to.equal('true');

  });

  it('Click Daily', async function () {

    const selector = 'new UiSelector().resourceId("com.accuweather.app:id/daily_forecast_fragment")';
    const daily = await driver.$(`android=${selector}`);

    daily.waitForEnabled(3000);

    daily.touchAction('tap');

  });

  it('Check Month', async function () {

    const selector = 'new UiSelector().resourceId("com.accuweather.app:id/month_header").childSelector(new UiSelector().className("android.widget.TextView"))'
    const monthName = await driver.$(`android=${selector}`);

    monthName.waitForEnabled(3000);

    expect(await monthName.getText()).to.equal(getMonthName());

  });

  it('Click Radar', async function () {

    const selector = 'new UiSelector().resourceId("com.accuweather.app:id/radar_fragment")';
    const radar = await driver.$(`android=${selector}`);

    radar.waitForEnabled(3000);

    radar.touchAction('tap');

    //await driver.pause(300000)

  });

  after('should destroy a session', async function () {

    await driver.removeApp('com.accuweather.app'); 
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

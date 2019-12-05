const webdriverio = require('webdriverio');
const assert = require('chai').assert;
const expect = require('chai').expect;
const path = require('path');

describe('E2E Test w.o Permissions', function () {

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
        autoGrantPermissions: false,
        allowTestPackages: true,
        fullReset: true,
        platformVersion: process.env.ANDROID_PLATFORM_VERSION || DEFAULT_ANDROID_PLATFORM_VERSION,
        app: app // Will be added in tests
      }},
      {
        host: process.env.APPIUM_HOST || 'localhost', port: process.env.APPIUM_PORT || 4723, logLevel: 'warn'
      }
    ));

    await driver.execute('mobile: changePermissions', {action: "revoke", appPackage: "com.accuweather.app", permissions: "android.permission.ACCESS_FINE_LOCATION"}); 
    await driver.execute('mobile: getPermissions', {type: "granted", appPackage: "com.accuweather.app"});

  });

  it('should create a Session', async function () {

    const res = await driver.status();
    assert.isObject(res.build);

    const current_package = await driver.getCurrentPackage();
    assert.equal(current_package, 'com.accuweather.app');

  });

  it('Perform a Search', async function () {

    const selector = 'new UiSelector().resourceId("com.accuweather.app:id/location_search_box")';
    const locationSearch = await driver.$(`android=${selector}`);

    locationSearch.waitForEnabled(3000);

    locationSearch.touchAction('tap');

    locationSearch.addValue('Austin');

  });

  it('Add a Favorite', async function () {

    const selector = 'new UiSelector().resourceId("com.accuweather.app:id/search_result_add_to_fav_icon")';
    const addFav = await driver.$(`android=${selector}`);

    addFav.waitForEnabled(3000);

    addFav.touchAction('tap');

  });

  it('Taps a Location', async function () {

    const selector = 'new UiSelector().textContains("Texas")';
    const locationResult = await driver.$(`android=${selector}`);

    expect(await locationResult.getText()).to.equal("Austin, Texas, US")

    await locationResult.waitForEnabled(3000);

    await locationResult.touchAction('tap');

  });

  after('should destroy a session', async function () {

    await driver.removeApp('com.accuweather.app');
    await driver.deleteSession();

  });

});
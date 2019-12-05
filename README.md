# Javascript WebdriverIO Client Sample Code

## Setup

* Must have NodeJS and NPM installed (https://nodejs.org/en/)
* Install dependencies by running `npm install`

## Pre-Reqs

* Android Studio Installed w. Installed & Running Emulator (tested on default Pixel 3 Emulator)
* Appium Desktop w. Default server Installed & Running
* Java SDK installed
* Bash Profile w. Environment Variables Updated & Installed (There's a copy of mine in this repo, copy to your user root folder, e.g "chorned")

## Running Tests

* To run the android example test, run `npm run test:android`

## Troubleshooting

* ```Original error: '12.1' does not exist in the list of simctl SDKs. Only the following Simulator SDK versions are available on your system: x.y```
  * By default, these example tests expect IOS version 12.1
  * If 12.1 isn't available on your system, set the version by setting environment variable `IOS_PLATFORM_VERSION`
    (e.g., `IOS_PLATFORM_VERSION=11.2 $(npm bin)/mocha -t 6000000 test/path/to/test.js`), or install the iOS 12.1 SDK with Xcode.

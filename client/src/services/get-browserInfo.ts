import { UAParser } from "ua-parser-js";

export type BrowserInfo = ReturnType<typeof getBrowserInfo>;

export default function getBrowserInfo() {
  const browserInfo = {
    browser: UAParser.BROWSER.NAME,
    browserVersion: UAParser.BROWSER.VERSION,
    os: UAParser.OS.NAME,
    osVersion: UAParser.OS.VERSION,
    deviceType: UAParser.DEVICE.TYPE || "desktop",
    userAgent: navigator.userAgent,
    language: navigator.language,
    screen: {
      width: window.screen.width,
      height: window.screen.height,
    },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
  return browserInfo;
}

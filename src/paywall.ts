import FingerprintJS from '@fingerprintjs/fingerprintjs-pro';
import axios from 'axios';

// @ts-ignore
const settings = window.paywallSettings;

const apiPath = 'http' + (settings.host.indexOf('localhost') === 0 ? '' : 's') + '://' + settings.host + '/paywall';

const fpPromise = FingerprintJS.load({token: settings.token, region: 'eu'});

let trackTimeOut;
let trackScrollTimeout;

// @ts-ignore
window.paywallId = new Promise((resolve => {
  fpPromise
    .then(fp => fp.get())
    .then(async (result) => {
      const { data } = await axios.post(apiPath + '/visit', { visitor: result.visitorId });
      resolve(data.enabled ? null : result.visitorId);
    });
}));

// @ts-ignore
window.paywallId.then(id => {
  if (!id) {
    return;
  }
  let oldHref = document.location.href;
  observeLocations(document.location, id);
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function() {
      if (oldHref != document.location.href) {
        oldHref = document.location.href;
        observeLocations(document.location, id);
      }
    });
  });
  observer.observe(document.querySelector("body"), {
    childList: true,
    subtree: true
  });
});

function observeLocations(location, visitor) {
  clearTimeout(trackTimeOut);
  if (!settings.rules) {
    return
  }
  settings.rules.forEach(rule => {
    if (location.pathname.indexOf(rule.path) === 0) {
      track(rule, location.pathname, visitor);
    }
  });
}

function track(rule, path, visitor) {
  axios.post(apiPath + '/visit/path', { path, visitor });
  const thresholdCb = () => axios.post(apiPath + '/visit/path', { path, visitor, threshold: true });
  trackScroll('[data-paywall]', thresholdCb);
  trackTimeOut = setTimeout(thresholdCb, rule.timeThreshold * 1000 * 60);
  // @ts-ignore
  window._wq = window._wq || [];
  // @ts-ignore
  _wq.push({ id: '_all', onReady: function(video) {
    clearTimeout(trackTimeOut);
    video.bind('secondchange', function(s) {
      if (s === rule.videoTimeThreshold * 60) {
        thresholdCb();
      }
    });
  }});
}

function isScrolledDown(el) {
  const rect = el.getBoundingClientRect();
  return rect.bottom < rect.height * 0.25
}

function trackScroll(selector, cb) {
  clearTimeout(trackScrollTimeout);
  trackScrollTimeout = setTimeout(() => {
    const el = document.querySelector(selector);
    if (!el) {
      return
    }
    if (isScrolledDown(el)) {
      cb();
      return;
    }
    trackScroll(selector, cb);
  }, 5000);
}
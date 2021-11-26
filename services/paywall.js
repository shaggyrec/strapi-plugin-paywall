'use strict';

/**
 * paywall.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const { exec } = require('child_process');
const fs = require('fs');
const { extractMeta } = require('./utils/functions');
const {visit} = require("../controllers/paywall");

module.exports = {
  async getSettings() {
    const { pluginName, models } = extractMeta(strapi.plugins);
    const ormModel = strapi.query(models.settings.modelName, pluginName);
    const settings = await ormModel.findOne();
    if (!settings) {
      return {};
    }
    if (settings.rules) {
      settings.rules = JSON.parse(settings.rules);
    }
    return settings;
  },

  async setSettings(s) {
    for (const setting in s) {
      if (typeof s[setting] === "object") {
        s[setting] = JSON.stringify(s[setting]);
      }
    }
    const { pluginName, models } = extractMeta(strapi.plugins);
    const ormModel = strapi.query(models.settings.modelName, pluginName);
    const currentSettings = await ormModel.findOne();
    if (currentSettings) {
      await ormModel.update(currentSettings.id, { ...currentSettings, ...s })
    } else {
      await ormModel.create(s)
    }
  },

  getContentTypes() {
    const types = {};
    for (const m in strapi.models) {
      if (strapi.models[m].modelName) {
        types[strapi.models[m].modelName] = strapi.models[m].attributes;
      }
    }
    return types;
  },

  async compileFrontend(host) {
    const settings = await this.getSettings();
    exec(
      'cd ' + __dirname + '/.. && ./node_modules/.bin/webpack --mode=production --output-path=' + process.cwd() + '/public',
        e => {
        console.log(e ? e.message : 'paywall.js has been compiled')
        if (e) {
          return;
        }
        const filePath = process.cwd() + '/public/paywall.js';
        fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
          fs.writeFile(
            filePath, 'window.paywallSettings=' + JSON.stringify({ ...settings, host: host}) + ';\n' + data,
            'utf8',
            err => console.log(err ? err.message : 'settings added')
          );
        });
      }
    );
  },

  async storeVisitor(visitor) {
    const { pluginName, models } = extractMeta(strapi.plugins);
    const ormModel = strapi.query(models.paywall.modelName, pluginName);
    let paywall = await ormModel.findOne({ visitor });
    if (!paywall) {
      await ormModel.create({ visitor });
      paywall = await this.getInfoByVisitorId(visitor);
    }
    return paywall
  },

  getInfoByVisitorId(visitor) {
    const { pluginName, models } = extractMeta(strapi.plugins);
    const ormModel = strapi.query(models.paywall.modelName, pluginName);
    return ormModel.findOne({ visitor });
  },
  async getContent(model, id, visitor) {
    const visitorInfo = this.getInfoByVisitorId(visitor);
    const settings = await this.getSettings();
    const o = await strapi.query(strapi.models[model].modelName).findOne({ id });

    return visitorInfo.enabled ? '...' : o[(settings.rules || []).find(r => r.model === model).field];
  },

  async storeVisit(visitor, path, threshold) {
    const settings = await this.getSettings()
    const { pluginName, models } = extractMeta(strapi.plugins);
    const ormModel = strapi.query(models.paywall.modelName, pluginName);
    const paywall = await ormModel.findOne({ visitor });

    let visits = paywall.visits ? JSON.parse(paywall.visits) : [];

    visits = visits.filter(v => v.path !== path);

    visits.push({ path, date: +(new Date()), threshold: threshold && +(new Date()) })

    paywall.enabled = paywall.reset_at
      ? visits.filter(v => v.date > paywall.reset_at).length >= settings.hardCapLimitation
      : visits.length >= settings.hardCapLimitation

    await ormModel.update(paywall.id, { visits: JSON.stringify(visits), enabled: paywall.enabled || !!threshold } );
  },

  async getVisits(q) {
    const { pluginName, models } = extractMeta(strapi.plugins);
    return (await strapi.query(models.paywall.modelName, pluginName).find(q))
      .map(p => ({ ...p, visits: p.visits ? JSON.parse(p.visits) : []}))
  },

  async getVisitsAmount() {
    const { pluginName, models } = extractMeta(strapi.plugins);
    return strapi.query(models.paywall.modelName, pluginName).count();
  },

  async resetPayload() {
    return strapi.connections.default.raw('UPDATE paywall SET reset_at = ' + (+new Date()) + ', enabled = FALSE WHERE id > 0');
  }
};
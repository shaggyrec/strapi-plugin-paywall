const { deepMap } = require('../../services/utils/functions');

function trimContent (content, wordsToShow) {
  return !wordsToShow ? '' : (content.replace(/<[^>]+>/gi, '').split(' ').slice(0, wordsToShow)).join(' ') + '...';
}

function replacePaywall(dataObject, modelSettingsMap, isUserAuthorized) {
  if (dataObject && dataObject.paywall) {
    const ruleSettings = modelSettingsMap[dataObject.paywall];
    if (!isUserAuthorized) {
      if (Array.isArray(dataObject[ruleSettings.field])) {
        if (dataObject[ruleSettings.field][0].richText) {
          dataObject[ruleSettings.field][0].richText = trimContent(dataObject[ruleSettings.field][0].richText, ruleSettings.wordsToShow)
        }
        if (dataObject[ruleSettings.field][0].text) {
          dataObject[ruleSettings.field][0].text = trimContent(dataObject[ruleSettings.field][0].text, ruleSettings.wordsToShow)
        }
        dataObject[ruleSettings.field] = [dataObject[ruleSettings.field][0]];
      } else {
        dataObject[ruleSettings.field] = trimContent(dataObject[ruleSettings.field], ruleSettings.wordsToShow)
      }
    }
    delete dataObject.paywall;
  }
  return dataObject;
}

async function runPaywall(paywallService, responseBody, isUserAuthorized) {
  const paywallSettings = await paywallService.getSettings();
  const settingsByModel = {};
  for (const rule of paywallSettings.rules || []) {
    settingsByModel[rule.model] = rule;
  }

  const replaceCB = o => replacePaywall(o, settingsByModel, isUserAuthorized);

  if (Array.isArray(responseBody)) {
    return deepMap(responseBody, replaceCB)
  }

  responseBody = replaceCB(responseBody);

  for (const f in responseBody) {
    if (Array.isArray(f)) {
      responseBody[f] = deepMap(responseBody[f], replaceCB)
    }
  }

  return responseBody;
}

function setPaywallParam(data, val) {
  data.paywall = val;
}

module.exports = strapi => {
  return {
    async initialize() {
      const paywallService = strapi.plugins.paywall.services.paywall;

      strapi.app.use(async (ctx, next) => {
        await next();
        ctx.response.body = await runPaywall(paywallService, ctx.response.body, !!ctx.state.user);
      });

      Object.keys(paywallService.getContentTypes()).forEach(modelName => {
        const ORMModel = strapi.query(modelName).model;
        let existedAfterFind;
        let existedAfterFindOne

        if (!ORMModel.lifecycles) {
          ORMModel.lifecycles = {};
        }
        if (ORMModel.lifecycles.afterFind) {
          existedAfterFind = ORMModel.lifecycles.afterFind;
        }
        if (ORMModel.lifecycles.afterFindOne) {
          existedAfterFindOne = ORMModel.lifecycles.afterFindOne
        }
        ORMModel.lifecycles.afterFind = async function (results, params, populate) {
          if (existedAfterFind) {
            await existedAfterFind(results, params, populate);
          }
          for (const r of results) {
            setPaywallParam(r, modelName);
          }
        }

        ORMModel.lifecycles.afterFindOne = async function (results, params, populate) {
          if (existedAfterFindOne) {
            await existedAfterFindOne(results, params, populate);
          }
          setPaywallParam(results, modelName);
        }
      });
    }
  }
};
'use strict';

/**
 * paywall.js controller
 *
 * @description: A set of functions called "actions" of the `paywall` plugin.
 */

function service() {
  return strapi.plugins.paywall.services.paywall;
}

module.exports = {
  setVisitorId: async ctx => {
    return {
      enabled: ctx.state.user ? true : !!(await service().storeVisitor(ctx.request.body.visitor)).enabled
    };
  },

  getSettings: async () => {
    return (await service().getSettings()) || {};
  },
  setSettings: async (ctx) => {
    await service().setSettings(ctx.request.body);
    service().compileFrontend(ctx.request.host);

    return { message: 'ok' };
  },
  contentTypes: () => service().getContentTypes(),

  getContent: async (ctx) => {
    return (await service().getContent(ctx.params.model, ctx.params.id, ctx.params.visitor));
  },

  visit: async (ctx) => {
    const { path, visitor, threshold } = ctx.request.body;
    await service().storeVisit(visitor, path, threshold);
    return 'ok';
  },

  list: (ctx) => {
    return service().getVisits(ctx.request.query);
  },

  listAmount: (ctx) => {
    return service().getVisitsAmount(ctx.request.query);
  },
  reset: async () => {
    await service().resetPayload();
    return 'ok';
  }
};

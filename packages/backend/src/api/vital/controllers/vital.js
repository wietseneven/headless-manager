'use strict';

/**
 *  vital controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::vital.vital', ({ strapi }) =>  ({
  async create(ctx) {
    const { data, app } = ctx.request.body;
    if (!app) {
      return ctx.badRequest('app is missing!')
    }

    const entry = await strapi.entityService.create('api::vital.vital', {
      data: {
        nextId: data.nextId,
        startTime: data.startTime,
        value: data.value,
        label: data.label,
        name: data.name,
        origin: data.origin,
        pathname: data.pathname,
        app: app.id,
      },
    });

    if (ctx.request.headers['content-type'].startsWith('text/plain')) {
      return { success: true };
    } else {
      return { data: { id: entry.id }, meta: {}};
    }
  }
}));

'use strict';

/**
 *  message controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::message.message', ({ strapi }) =>  ({
  async create(ctx) {
    const { data, app } = ctx.request.body;
    if (!app) {
        return ctx.badRequest('app is missing!')
    }
    if (!data.ip) {
        return ctx.badRequest('ip is missing!')
    }

    const entry = await strapi.entityService.create('api::message.message', {
      data: {
        level: data.level,
        message: data.message,
        app: app.id,
        ip: data.ip,
      },
      populate: ['app']
    });
    return { data: { ...entry }, meta: {} };
  }
}));

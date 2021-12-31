'use strict';

/**
 *  message controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::message.message', ({ strapi }) =>  ({
  async create(ctx) {
    const { data } = ctx.request.body;
    if (!data.app) {
        return ctx.badRequest('app is missing!')
    }
    if (!data.ip) {
        return ctx.badRequest('ip is missing!')
    }
    const entry = await strapi.entityService.create('api::message.message', {
      data: {
        level: data.level,
        message: data.message,
        app: data.app,
        ip: data.ip,
      },
    });
    return { data: entry, meta: {} };
  }
}));

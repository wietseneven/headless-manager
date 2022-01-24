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

    await strapi.entityService.create('api::message.message', {
      data: {
        level: data.level,
        label: data.label,
        message: data.message,
        app: app.id,
        ip: data.ip,
      },
      populate: ['app']
    });
    // We don't want to send a response body, just a success
    ctx.response.status = 200;
  }
}));

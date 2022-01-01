'use strict';
const { ApplicationError } = require('@strapi/utils').errors;

module.exports = {
  async list(ctx) {
    try {
      const result = await strapi
        .plugin('slack')
        .service('channels')
        .list();
      ctx.send({
        ...result,
        channels: result.channels.map((channel) => ({
          id: channel.id,
          name: channel.name,
        })),
      });
    } catch (e) {
      if (e.statusCode === 400) {
        throw new ApplicationError(e.message);
      } else {
        throw new Error(`Couldn't send email: ${e.message}.`);
      }
    }
  },
};

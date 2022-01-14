'use strict';
const { ApplicationError } = require('@strapi/utils').errors;
const { pick } = require('lodash/fp');

module.exports = {
  async send(ctx) {
    let options = ctx.request.body;

    try {
      await strapi
        .plugin('email')
        .service('email')
        .send(options);
    } catch (e) {
      if (e.statusCode === 400) {
        throw new ApplicationError(e.message);
      } else {
        throw new Error(`Couldn't send email: ${e.message}.`);
      }
    }

    // Send 200 `ok`
    ctx.send({});
  },
  async test(ctx) {
    const options = ctx.request.body;
    try {
      await strapi.plugin('slack').service('message').test(options);
    } catch (e) {
      console.log(e.message);
      if (e.statusCode === 400) {
        throw new ApplicationError(e.message);
      } else {
        throw new ApplicationError(`Couldn't send message: ${e.message}.`);
      }
    }
    ctx.send({});
  },
  async getSettings(ctx) {
    const config = strapi
      .plugin('slack')
      .service('message')
      .getProviderSettings();

    ctx.send({
      config: pick(
        ['token'],
        config
      ),
    });
  },

  // index(ctx) {
  //   ctx.body = strapi
  //     .plugin('slack')
  //     .service('myService')
  //     .getWelcomeMessage();
  // },
};

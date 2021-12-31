'use strict';

/**
 * message router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::message.message', {
  config: {
    create: {
      auth: false,
      policies: ['is-app'],
    }
  }
});

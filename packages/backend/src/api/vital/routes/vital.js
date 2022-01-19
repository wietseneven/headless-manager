'use strict';

/**
 * vital router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::vital.vital', {
  config: {
    create: {
      auth: false,
      policies: ['api::message.is-app'],
    }
  }
});

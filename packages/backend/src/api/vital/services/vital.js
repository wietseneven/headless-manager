'use strict';

/**
 * vital service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::vital.vital');

'use strict';

/**
 * `is-app` policy.
 */

module.exports = async (policyContext, config, { strapi }) => {
  const appKey = policyContext.request.header['x-app-key'];
  const ip = policyContext.request.ip;
  // It's illegal to try to manually define the app, must come from the appKey
  const appInBody = policyContext.request.body.data.app
  if (!appKey || !ip || appInBody) return false;

  const app = await strapi.db.query('api::app.app').findOne({
    where: { key: appKey },
  });

  if (!app || !app.publishedAt) return false;
  policyContext.request.body.data.app = app.id;
  policyContext.request.body.data.ip = ip;

  return true;
};

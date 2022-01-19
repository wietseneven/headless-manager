'use strict';

/**
 * `is-app` policy.
 */

module.exports = async (policyContext, config, { strapi }) => {
  const appInHeader = policyContext.request.header['x-app-key'];
  const rawBody = policyContext.request.body;
  let parsedData = rawBody?.data;
  if (typeof rawBody === 'string') {
    try {
      const parsedBody = JSON.parse(rawBody);
      policyContext.request.body = parsedBody;
      parsedData = parsedBody.data;
    } catch (e) {
      // continue
      console.info(e);
    }
  }
  const appInBody = parsedData.app;
  const appKey = appInHeader || appInBody;
  const ip = policyContext.request.ip;
  if (!appKey || !ip || !parsedData) return false;

  const app = await strapi.db.query('api::app.app').findOne({
    where: { key: appKey },
  });

  if (!app || !app.publishedAt) return false;
  policyContext.request.body.app = app;
  policyContext.request.body.data.app = app.id;
  policyContext.request.body.data.ip = ip;

  return true;
};

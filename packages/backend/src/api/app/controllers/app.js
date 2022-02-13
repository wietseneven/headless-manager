'use strict';
const messageSchema = require('../../message/content-types/message/schema.json');

/**
 *  app controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

const countKeys = (acc, item) => {
  return {
    ...acc,
    [item.level]: Number(item.messages),
    total: acc.total + Number(item.messages || 0)
  };
};

module.exports = createCoreController('api::app.app', ({ strapi }) => ({
  getStats: async (ctx, next) => {
    const { id } = ctx.request.params;
    const dateOffset = 24 * 60 * 60 * 1000; // 1 day
    const oneDayAgo = new Date();
    oneDayAgo.setTime(oneDayAgo.getTime() - dateOffset);

    const { dateEnd = new Date(), dateStart = oneDayAgo } = ctx.request.query;
    try {
      const knex = strapi.db.connection;
      const levels = messageSchema.attributes.level.enum;

      const totalRaw = await strapi.db.connection('messages')
        .where('messages.created_at', '>', dateStart)
        .where('messages.created_at', '<', dateEnd)
        .join('messages_app_links', 'messages.id', 'messages_app_links.message_id')
        .where('messages_app_links.app_id', id)
        .groupBy('level')
        .count({ messages: '*' })
        .select('level');

      const total = totalRaw.reduce(countKeys, { total: 0 });
      // const total = levels.reduce(countKeys(totalRaw), { total: 0 });

      const labelsRaw = await strapi.db.connection('messages')
        .where('messages.created_at', '>', dateStart)
        .where('messages.created_at', '<', dateEnd)
        .join('messages_app_links', 'messages.id', 'messages_app_links.message_id')
        .where('messages_app_links.app_id', id)
        .groupBy('label')
        .count({ count: '*' })
        .select('label')
        .orderBy('count', 'desc');

      const labels = labelsRaw.map((label) => ({
        label: label.label,
        count: Number(label.count),
      }));

      const getBaseSubQuery = (level) => {
        return knex('messages')
          .whereRaw('DATE(messages.created_at) = date')
          .join('messages_app_links', 'messages.id', 'messages_app_links.message_id')
          .where('messages_app_links.app_id', id)
          .where('level', level)
          .count({ [level]: '*' })
          .as(level);
      };

      const levelSubQueries = levels.map((level) => getBaseSubQuery(level));

      const byDay = await knex('messages')
        .join('messages_app_links', 'messages.id', 'messages_app_links.message_id')
        .where('messages_app_links.app_id', id)
        .where('messages.created_at', '>', dateStart)
        .where('messages.created_at', '<', dateEnd)
        .select(
          knex.raw('DATE(created_at) date'),
          ...levelSubQueries,
        )
        .groupBy(knex.raw('DATE(created_at)'))
        .count({ total: '*' })
        .orderBy('date', 'desc')
        .limit(14);

      ctx.body = {
        total,
        labels,
        byDay: byDay.map((day) => {
          return Object.entries(day).reduce((acc, [key, value]) => ({
            ...acc,
            [key]: key === 'date' ? value : Number(value),
          }), {});
        }),
      };
    } catch (err) {
      console.error(err);
      ctx.body = err;
    }
  }
}));

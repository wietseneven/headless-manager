'use strict';
const axios = require('axios');

module.exports = ({ strapi }) => ({
  async list() {
    const config = strapi.config.get('plugin.slack');
    if (!config.token) {
      throw new Error('No auth token!');
    }
    const { data } = await axios.post('https://slack.com/api/conversations.list', null,{
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Content-type': 'application/json; charset=utf-8',
      }
    });
    if (!data.ok) {
      throw new Error(data.error);
    }
    return data;
  }
});

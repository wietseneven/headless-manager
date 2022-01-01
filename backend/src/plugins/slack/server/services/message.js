'use strict';
const axios = require('axios');

module.exports = ({ strapi }) => ({
  async send(options) {
    const config = await strapi.config.get('plugin.slack');
    const { data } = await axios.post('https://slack.com/api/chat.postMessage', options, {
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Content-type': 'application/json; charset=utf-8',
      }
    });
    if (!data.ok) {
      throw new Error(data.error);
    }
    return data;
  },
  async test(options) {
    const config = strapi.config.get('plugin.slack');
    const { data } = await axios.post('https://slack.com/api/chat.postMessage', options, {
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Content-type': 'application/json; charset=utf-8',
      }
    });
    if (!data.ok) {
      throw new Error(data.error);
    }
    return data;
  },
  getProviderSettings() {
    return strapi.config.get('plugin.slack');
  }
});

'use strict';

module.exports = async ({ strapi }) => {
  const slackConfig = strapi.config.get('plugin.slack');

  // Add permissions
  const actions = [
    {
      section: 'settings',
      category: 'slack',
      displayName: 'Access the Slack Settings page',
      uid: 'settings.read',
      pluginName: 'slack',
    },
  ];

  // bootstrap phase
  await strapi.admin.services.permission.actionProvider.registerMany(actions);
};

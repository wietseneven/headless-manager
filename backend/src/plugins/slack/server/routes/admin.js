'use strict';

module.exports = {
  type: 'admin',
  routes: [
    {
      method: 'POST',
      path: '/',
      handler: 'message.send',
      config: {
        policies: ['admin::isAuthenticatedAdmin'],
      },
    },
    {
      method: 'POST',
      path: '/test',
      handler: 'message.test',
      config: {
        policies: [
          'admin::isAuthenticatedAdmin',
          { name: 'admin::hasPermissions', config: { actions: ['plugin::slack.settings.read'] } },
        ],
      },
    },
    {
      method: 'GET',
      path: '/channels',
      handler: 'channels.list',
      config: {
        policies: ['admin::isAuthenticatedAdmin'],
      },
    },
    {
      method: 'GET',
      path: '/settings',
      handler: 'message.getSettings',
      config: {
        policies: [
          'admin::isAuthenticatedAdmin',
          { name: 'admin::hasPermissions', config: { actions: ['plugin::slack.settings.read'] } },
        ],
      },
    },
  ],
};

module.exports = {
  routes: [
    { // Path defined with a URL parameter
      method: 'GET',
      path: '/apps/:id/stats',
      handler: 'api::app.app.getStats',
    },
  ]
};

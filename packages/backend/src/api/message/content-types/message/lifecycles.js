module.exports = {
  async afterCreate(event, a) {
    const { result, params } = event;
    const { channel } = result.app;

    if (!channel) return;
    await strapi.plugins['slack'].services.message.send({
      channel,
      text: JSON.stringify(result),
    });
  },
};


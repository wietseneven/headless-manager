module.exports = ({ env }) => ({
  slack: {
    enabled: true,
    resolve: './src/plugins/slack',
    config: {
      token: env('SLACK_TOKEN', ''),
    }
  }
})

/**
 * @type {import('strapi-to-typescript')}
 */
const config = {
  input: [
    './packages/backend/src/api',
    // './backend/src/api/client/content-types/client/schema.json',
    // './backend/src/api/message/content-types/message/schema.json',
    // './backend/node_modules/strapi-plugin-users-permissions/models/',
    // './backend/node_modules/strapi-plugin-upload/models/',
    // './backend/extensions/users-permissions/models/'
  ],
  output: './types'
}
module.exports = config;
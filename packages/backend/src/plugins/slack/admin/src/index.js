import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';

const name = pluginPkg.strapi.name;

export default {
  register(app) {
    app.createSettingSection(
      {
        id: `${pluginId}.plugin.name`,
        intlLabel: {
          id: `${pluginId}.plugin.name`,
          defaultMessage: name,
        },
      },
      [ // links
        {
          intlLabel: { id: `${pluginId}.plugin.name`, defaultMessage: 'Configuration' },
          id: pluginId,
          to: `/settings/${pluginId}`,
          Component: async () => {
            const component = await import(/* webpackChunkName: "slack-settings-page" */ './pages/Settings');

            return component;
          },
          permissions: [],
        }
      ]
    );
    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    });
  },

  bootstrap(app) {},
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map(locale => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};

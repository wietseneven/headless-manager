/* eslint-disable no-useless-escape */

import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Stack } from '@strapi/design-system/Stack';
import { Grid, GridItem } from '@strapi/design-system/Grid';
import { Typography } from '@strapi/design-system/Typography';
import { TextInput } from '@strapi/design-system/TextInput';
import { Select, Option } from '@strapi/design-system/Select';
import getTrad from '../../../utils/getTrad';

const Configuration = ({ config }) => {
  const { formatMessage } = useIntl();

  return (
    <Stack size={4}>
      <Stack size={1}>
        <Typography variant="delta" as="h2">
          {formatMessage({
            id: getTrad('Settings.slack.plugin.title.config'),
            defaultMessage: 'Configuration',
          })}
        </Typography>
        <Typography>
          {formatMessage(
            {
              id: getTrad('Settings.slack.plugin.text.configuration'),
              defaultMessage:
                'The plugin is configured through the {file} file, checkout this {link} for the documentation.',
            },
            {
              file: './config/plugins.js',
              link: (
                <a
                  href="https://docs.strapi.io/developer-docs/latest/plugins/slack.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  link
                </a>
              ),
            }
          )}
        </Typography>
      </Stack>
      <Grid gap={5}>
        <GridItem col={6} s={12}>
          <TextInput
            name="shipper-email"
            label={formatMessage({
              id: getTrad('Settings.slack.plugin.label.token'),
              defaultMessage: 'Slack Bearer token',
            })}
            placeholder={formatMessage({
              id: getTrad('Settings.slack.plugin.placeholder.token'),
              defaultMessage: `ex: xoxb-not-a-real-token-this-will-not-work`,
            })}
            disabled
            onChange={() => {}}
            value={config.token}
          />
        </GridItem>
        {/*<GridItem col={6} s={12}>*/}
        {/*  <TextInput*/}
        {/*    name="response-email"*/}
        {/*    label={formatMessage({*/}
        {/*      id: getTrad('Settings.slack.plugin.label.defaultReplyTo'),*/}
        {/*      defaultMessage: 'Default response email',*/}
        {/*    })}*/}
        {/*    placeholder={formatMessage({*/}
        {/*      id: getTrad('Settings.slack.plugin.placeholder.defaultReplyTo'),*/}
        {/*      defaultMessage: `ex: Strapi \<example@strapi.io\>`,*/}
        {/*    })}*/}
        {/*    disabled*/}
        {/*    onChange={() => {}}*/}
        {/*    value={config.settings.defaultReplyTo}*/}
        {/*  />*/}
        {/*</GridItem>*/}
        {/*<GridItem col={6} s={12}>*/}
        {/*  <Select*/}
        {/*    name="email-provider"*/}
        {/*    label={formatMessage({*/}
        {/*      id: getTrad('Settings.slack.plugin.label.provider'),*/}
        {/*      defaultMessage: 'Slack provider',*/}
        {/*    })}*/}
        {/*    disabled*/}
        {/*    onChange={() => {}}*/}
        {/*    value={config.provider}*/}
        {/*  >*/}
        {/*    <Option value={config.provider}>{config.provider}</Option>*/}
        {/*  </Select>*/}
        {/*</GridItem>*/}
      </Grid>
    </Stack>
  );
};

Configuration.propTypes = {
  config: PropTypes.shape({
    token: PropTypes.string,
    // settings: PropTypes.shape({
    //   defaultFrom: PropTypes.string,
    //   defaultReplyTo: PropTypes.string,
    // }),
  }).isRequired,
};

export default Configuration;

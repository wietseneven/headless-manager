import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash';
import {
  getYupInnerErrors,
  CheckPagePermissions,
  useNotification,
  LoadingIndicatorPage,
  useOverlayBlocker,
  useFocusWhenNavigate,
} from '@strapi/helper-plugin';
import { Main } from '@strapi/design-system/Main';
import { ContentLayout } from '@strapi/design-system/Layout';
import { Stack } from '@strapi/design-system/Stack';
import { Box } from '@strapi/design-system/Box';
import { Grid, GridItem } from '@strapi/design-system/Grid';
import { Typography } from '@strapi/design-system/Typography';
import { Select, Option } from '@strapi/design-system/Select';
import { TextInput } from '@strapi/design-system/TextInput';
import { Button } from '@strapi/design-system/Button';
import { useNotifyAT } from '@strapi/design-system/LiveRegions';
import Envelop from '@strapi/icons/Envelop';
import Configuration from './components/Configuration';
import schema from '../../utils/schema';
import pluginPermissions from '../../permissions';
import { fetchSlackSettings, fetchSlackChannels, postMessageTest } from './utils/api';
import EmailHeader from './components/EmailHeader';
import getTrad from '../../utils/getTrad';

const ProtectedSettingsPage = () => (
  <CheckPagePermissions permissions={pluginPermissions.settings}>
    <SettingsPage />
  </CheckPagePermissions>
);

const SettingsPage = () => {
  const toggleNotification = useNotification();
  const { formatMessage } = useIntl();
  const { lockApp, unlockApp } = useOverlayBlocker();
  const { notifyStatus } = useNotifyAT();
  useFocusWhenNavigate();

  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [channels, setChannels] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testChannel, setTestChannel] = useState('');
  const [testText, setTestText] = useState('');
  const [isTestChannelValid, setIsTestChannelValid] = useState(false);
  const [config, setConfig] = useState({
    token: '',
  });

  useEffect(() => {
    setIsLoading(true);

    fetchSlackSettings()
      .then(config => {
        notifyStatus(
          formatMessage({
            id: getTrad('Settings.slack.plugin.notification.data.loaded'),
            defaultMessage: 'Slack settings data has been loaded',
          })
        );
        setConfig(config);

        const testChannelFound = get(config, 'settings.testChannel');
        const testTextFound = get(config, 'settings.testText');

        if (testChannelFound) {
          setTestChannel(testChannelFound);
        }
        if (testTextFound) {
          setTestText(testTextFound);
        }

        fetchSlackChannels()
          .then((data) => {
            setChannels(data);
          });
      })
      .catch(() =>
        toggleNotification({
          type: 'warning',
          message: formatMessage({
            id: getTrad('Settings.slack.plugin.notification.config.error'),
            defaultMessage: 'Failed to retrieve the slack config',
          }),
        })
      )
      .finally(() => setIsLoading(false));
  }, [formatMessage, toggleNotification, notifyStatus]);

  useEffect(() => {
    if (formErrors.channel) {
      const input = document.querySelector('#test-channel-input');
      input.focus();
    }
    if (formErrors.text) {
      const input = document.querySelector('#test-text-input');
      input.focus();
    }
  }, [formErrors]);

  useEffect(() => {
    schema
      .validate({ channel: testChannel, text: testText }, { abortEarly: false })
      .then(() => setIsTestChannelValid(true))
      .catch(() => setIsTestChannelValid(false));
  }, [testChannel, testText]);

  const handleChange = e => {
    setTestChannel(() => e);
  };

  const handleMessageChange = e => {
    setTestText(() => e.target.value);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      await schema.validate({ channel: testChannel, text: testText }, { abortEarly: false });

      setIsSubmitting(true);
      lockApp();

      postMessageTest({ channel: testChannel, text: testText })
        .then(() => {
          toggleNotification({
            type: 'success',
            message: formatMessage(
              {
                id: getTrad('Settings.slack.plugin.notification.test.success'),
                defaultMessage: 'Message test succeeded, check the #{to} channel',
              },
              { to: testChannel }
            ),
          });
        })
        .catch((e) => {
          toggleNotification({
            type: 'warning',
            message: formatMessage(
              {
                id: getTrad('Settings.slack.plugin.notification.test.error'),
                defaultMessage: 'Failed to send a test message to #{to}. Message: {error}',
              },
              { to: testChannel, error: e.message }
            ),
          });
        })
        .finally(() => {
          setIsSubmitting(false);
          unlockApp();
        });
    } catch (error) {
      setFormErrors(getYupInnerErrors(error));
    }
  };

  if (isLoading) {
    return (
      <Main labelledBy="title" aria-busy="true">
        <EmailHeader />
        <ContentLayout>
          <LoadingIndicatorPage />
        </ContentLayout>
      </Main>
    );
  }

  return (
    <Main labelledBy="title" aria-busy={isSubmitting}>
      <EmailHeader />
      <ContentLayout>
        <form onSubmit={handleSubmit}>
          <Stack size={7}>
            <Box
              background="neutral0"
              hasRadius
              shadow="filterShadow"
              paddingTop={6}
              paddingBottom={6}
              paddingLeft={7}
              paddingRight={7}
            >
              <Configuration config={config} />
            </Box>
            <Box
              background="neutral0"
              hasRadius
              shadow="filterShadow"
              paddingTop={6}
              paddingBottom={6}
              paddingLeft={7}
              paddingRight={7}
            >
              <Stack size={4}>
                <Typography variant="delta" as="h2">
                  {formatMessage({
                    id: getTrad('Settings.slack.plugin.title.test'),
                    defaultMessage: 'Test message delivery',
                  })}
                </Typography>
                <Grid gap={5} alignItems="end">
                  <GridItem col={6} s={12}>
                    <Select
                      disabled={!channels.length}
                      id="test-channel-input"
                      name="test-channel"
                      onChange={handleChange}
                      label={formatMessage({
                        id: getTrad('Settings.slack.plugin.label.testChannel'),
                        defaultMessage: 'Recipient channel',
                      })}
                      value={testChannel}
                      error={
                        formErrors.channel?.id &&
                        formatMessage({
                          id: getTrad(`${formErrors.channel?.id}`),
                          defaultMessage: 'This is an invalid channel',
                        })
                      }
                      placeholder={formatMessage({
                        id: 'Settings.slack.plugin.placeholder.testChannel',
                        defaultMessage: 'ex: general',
                      })}
                    >
                      {channels.map(({ id, name }) => (
                        <Option key={id} value={id}>{name}</Option>
                      ))}
                    </Select>
                  </GridItem>
                  <GridItem col={6} s={12}>
                    <TextInput
                      id="test-text-input"
                      name="test-text"w
                      onChange={handleMessageChange}
                      label={formatMessage({
                        id: getTrad('Settings.slack.plugin.label.testText'),
                        defaultMessage: 'Message',
                      })}
                      value={testText}
                      error={
                        formErrors.text?.id &&
                        formatMessage({
                          id: getTrad(`${formErrors.text?.id}`),
                          defaultMessage: 'This is an invalid message',
                        })
                      }
                      placeholder={formatMessage({
                        id: 'Settings.slack.plugin.placeholder.testText',
                        defaultMessage: 'ex: This is a test message from Strapi!',
                      })}
                    />
                  </GridItem>
                  <GridItem col={7} s={12}>
                    <Button
                      loading={isSubmitting}
                      disabled={!isTestChannelValid}
                      type="submit"
                      startIcon={<Envelop />}
                    >
                      Send test message
                    </Button>
                  </GridItem>
                </Grid>
              </Stack>
            </Box>
          </Stack>
        </form>
      </ContentLayout>
    </Main>
  );
};

export default ProtectedSettingsPage;

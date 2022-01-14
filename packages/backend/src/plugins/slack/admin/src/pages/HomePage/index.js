/*
 *
 * HomePage
 *
 */

import React, { memo } from 'react';
import { HeaderLayout } from '@strapi/design-system';

// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';

const HomePage = () => {
  return (
    <div>
      <HeaderLayout title="Slack settings" />
      <h1>Lorem ipsum</h1>
      <p>Happy coding</p>
    </div>
  );
};

export default memo(HomePage);

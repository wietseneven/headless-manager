'use strict';

module.exports = {
  default: {
    token: undefined,
  },
  validator: (config) => {
    if (typeof config.token !== 'string') {
      throw new Error('Token has to be a string');
    }
  },
};

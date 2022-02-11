# Headless Manager Client

## Installation
Using Yarn
```cli
yarn add headless-manager-client
```

Or NPM
```cli
npm install headless-manager-client
```

## Usage
1. Create the logger
```typescript
// src/util/logger.ts
import Logger from 'headless-manager-client';
import axios from 'axios';

const logger = new Logger({
  appId: process.env.HM_APP_ID,
  apiUrl: process.env.HM_API_URL,
  submitEnabled: process.env.NODE_ENV !== 'development',
  // when using server side, also include a fetch client, e.g. node-fetch or axios
  fetchInstance: axios,
});

export default logger;
```

2. Start logging
```typescript
// src/lib/funcName.ts
import logger from '../util/logger';

const myAsyncFunc = async () => {
  logger.info('myAsyncFunc', 'Starting some async stuff');
  try {
    // some async logic
    logger.http('myAsyncFunc', 'Successfully did some logic');
  } catch (e) {
    logger.error('myAsyncFunc', 'Failed the async logic!', e);
  }
}
```

## Log levels
- error
- warn
- info
- http
- verbose
- debug
- silly
import { NextWebVitalsMetric } from 'next/app';
import '../assets/css/style.css';
import { createContext } from 'react';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import theme from '../styles/theme';
import createEmotionCache from '../utils/createEmotionCache';
import logger from '../lib/logger';
import { APP_KEY } from '../lib/constants';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

// Store Strapi Global object in context
export const GlobalContext = createContext({});

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export function reportWebVitals(metric: NextWebVitalsMetric) {
  logger.vital(metric);
  logger.silly('bier');
}

const MyApp = ({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: MyAppProps) => {
  const { global = {} } = pageProps;

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalContext.Provider value={global.attributes}>
          <Component {...pageProps} />
        </GlobalContext.Provider>
      </ThemeProvider>
    </CacheProvider>
  );
};

// getInitialProps disables automatic static optimization for pages that don't
// have getStaticProps. So article, category and home pages still get SSG.
// Hopefully we can replace this with getStaticProps once this issue is fixed:
// https://github.com/vercel/next.js/discussions/10949
// MyApp.getInitialProps = async (ctx) => {
//   // Calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(ctx)
//   // Fetch global site settings from Strapi
//   const globalRes = await fetchAPI("/global", {
//     populate: {
//       favicon: "*",
//       defaultSeo: {
//         populate: "*",
//       },
//     },
//   })
//   // Pass the data to our page via props
//   return { ...appProps, pageProps: { global: globalRes.data } }
// }

export default MyApp;

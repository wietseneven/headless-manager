import { NextWebVitalsMetric } from 'next/app';
import '../assets/css/style.css';
import { createContext } from 'react';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { DefaultSeo } from 'next-seo';
import SEO from '../next-seo.config';
import { SnackbarProvider } from 'notistack';

import theme from '../styles/theme';
import createEmotionCache from '../utils/createEmotionCache';
import logger from '../lib/logger';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

// Store Strapi Global object in context
export const GlobalContext = createContext({});

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export function reportWebVitals(metric: NextWebVitalsMetric) {
  const { origin, pathname } = window.location;
  logger.vital({ ...metric, origin, pathname });
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
        <DefaultSeo {...SEO} />
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <GlobalContext.Provider value={global.attributes}>
            <Component {...pageProps} />
          </GlobalContext.Provider>
        </SnackbarProvider>
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

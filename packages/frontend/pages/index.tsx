import React from 'react';
import Layout from '@components/layout';
import { fetchAPI } from '../lib/api';
import { Container, Typography } from '@mui/material';
import { IApp } from '../../../types';
import AppCard from '@components/views/AppCard';

interface App {
  id: string;
  attributes: IApp;
}

interface Props {
  apps: App[];
}

const Home = ({ apps }: Props) => {
  return (
    <Layout>
      {/*<Seo seo={homepage.attributes.seo} />*/}
      <Container sx={{ pt: 2 }}>
        <Typography gutterBottom variant="h1">
          Apps
        </Typography>
        {apps.map((app) => (
          <AppCard key={app.id} id={app.id} app={app.attributes} />
        ))}
      </Container>
    </Layout>
  );
};

export async function getStaticProps() {
  // Run API calls in parallel
  const [appsRes] = await Promise.all([
    fetchAPI('/apps', {
      populate: {
        client: '*',
      },
      sort: 'updatedAt:asc',
    }),
  ]);

  // logger.info('Hello from the server!');

  return {
    props: {
      apps: appsRes.data,
    },
    revalidate: 1,
  };
}

export default Home;

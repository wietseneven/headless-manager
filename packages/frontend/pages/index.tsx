import { Fragment } from 'react';
import Layout from '@components/layout';
import { fetchAPI } from '@lib/api';
import { Box, Container, Typography } from '@mui/material';
import { IApp, IClient } from '@strapi-types';
import AppCard from '@components/views/AppCard';

interface App {
  id: string;
  attributes: IApp;
}

interface Client {
  id: string;
  attributes: IClient & {
    apps: {
      data: App[];
    };
  };
}

interface Props {
  apps: App[];
  clients: Client[];
}

const Home = ({ clients }: Props) => {
  return (
    <Layout title="Dashboard">
      {/*<Seo seo={homepage.attributes.seo} />*/}
      <Container sx={{ pt: 2 }}>
        <Typography gutterBottom variant="h1">
          Projects
        </Typography>
        {clients.map((client) => (
          <Fragment key={client.id}>
            <Typography gutterBottom variant="h2">
              {client.attributes.name}
            </Typography>
            <Box
              display="grid"
              gridTemplateColumns={['1fr', '1fr 1fr', '1fr 1fr 1fr']}
              gap={2}
            >
              {client.attributes.apps?.data?.map((app) => (
                <AppCard key={app.id} id={app.id} app={app.attributes} />
              ))}
            </Box>
          </Fragment>
        ))}
      </Container>
    </Layout>
  );
};

export async function getStaticProps() {
  // Run API calls in parallel
  const [clientsRes] = await Promise.all([
    fetchAPI('/clients', {
      populate: {
        apps: '*',
      },
      sort: 'updatedAt:asc',
    }),
  ]);

  return {
    props: {
      clients: clientsRes.data,
    },
    revalidate: 1,
  };
}

export default Home;

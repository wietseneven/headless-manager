import { Fragment, useCallback, useState } from 'react';
import Layout from '@components/layout';
import { fetchAPI } from '@lib/api';
import {
  Box,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Container,
  Dialog,
  IconButton,
  Typography,
} from '@mui/material';
import { IApp, IClient } from '@strapi-types';
import AppCard from '@components/views/AppCard';
import AddIcon from '@mui/icons-material/Add';
import CreateAppForm from '@components/forms/CreateAppForm';
import { useRouter } from 'next/router';

interface App {
  id: string;
  attributes: IApp;
}

interface Client {
  id: number;
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
  const router = useRouter();
  const [createDialogOpen, setCreateDialogOpen] = useState<null | number>(null);

  const closeCreateDialog = useCallback(() => {
    setCreateDialogOpen(null);
  }, [setCreateDialogOpen]);

  return (
    <Layout title="Dashboard">
      {/*<Seo seo={homepage.attributes.seo} />*/}
      <Container sx={{ pt: 2 }}>
        <Typography gutterBottom variant="h1">
          Apps
        </Typography>
        {clients.map((client) => (
          <Fragment key={client.id}>
            <Box
              component="header"
              alignItems="center"
              display="flex"
              justifyContent="space-between"
              id={`cient-${client.id}`}
            >
              <Typography gutterBottom variant="h2">
                {client.attributes.name}
              </Typography>
              <IconButton
                onClick={() => setCreateDialogOpen(client.id)}
                aria-label="Add application"
              >
                <AddIcon />
              </IconButton>
            </Box>
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
      <Dialog open={!!createDialogOpen} onClose={closeCreateDialog}>
        <DialogTitle>Add an application</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add a project, fill out this little form
          </DialogContentText>
          <CreateAppForm
            onSuccess={(appId) => router.push(`/apps/${appId}`)}
            clientId={createDialogOpen}
          />
        </DialogContent>
      </Dialog>
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

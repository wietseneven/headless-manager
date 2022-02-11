import Layout from '@components/layout';
import { fetchAPI } from '@lib/api';
import {
  Breadcrumbs,
  Link as MuiLink,
  Container,
  Typography,
} from '@mui/material';
import { IApp } from '@strapi-types';
import { GetStaticProps } from 'next';
import AppMessages from '@components/views/AppMessages';
import Link from 'next/link';

interface App {
  id: string;
  attributes?: IApp & {
    client: {
      data: {
        id: number;
        attributes: {
          createdAt: string;
          updatedAt: string;
          name: string;
        };
      };
    };
  };
}

interface Props {
  app: App;
}

const Project = ({ app }: Props) => {
  const title = app.attributes?.name || 'App';
  const client = app.attributes?.client;
  return (
    <Layout title={title}>
      {/*<Seo seo={homepage.attributes.seo} />*/}
      <Container sx={{ pt: 6 }}>
        <Breadcrumbs sx={{ mb: 1 }} aria-label="breadcrumb">
          <Link href="/" passHref>
            <MuiLink underline="hover" color="inherit">
              Projects
            </MuiLink>
          </Link>
          <Link href={`/clients/${client?.id}`} passHref>
            <MuiLink underline="hover" color="inherit">
              {client?.data.attributes.name}
            </MuiLink>
          </Link>
          <Typography color="text.primary">{title}</Typography>
        </Breadcrumbs>
        <Typography gutterBottom variant="h1">
          {title}
        </Typography>
        <AppMessages id={app.id} />
      </Container>
    </Layout>
  );
};

export async function getStaticPaths() {
  const apps = await fetchAPI(`/apps`, {
    sort: 'updatedAt:asc',
  });

  const paths = apps.data.map(({ id }: App) => ({
    params: { appId: `${id}` },
  }));

  return {
    paths,
    fallback: true, // false or 'blocking'
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // Run API calls in parallel
  const appData = await fetchAPI(`/apps/${params?.appId}`, {
    populate: {
      client: '*',
    },
    sort: 'updatedAt:asc',
  });

  return {
    props: {
      app: appData.data,
    },
    revalidate: 1,
  };
};

export default Project;

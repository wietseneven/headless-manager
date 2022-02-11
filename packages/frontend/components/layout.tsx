import Nav from './nav';
import { Box, Container, Typography } from '@mui/material';
import { Theme } from '@mui/material/styles';
import Link from 'next/link';
import { ReactNode } from 'react';
import { NextSeo } from 'next-seo';

interface Props {
  children: ReactNode;
  title: string;
}

const Layout = ({ title, children }: Props) => (
  <>
    <NextSeo title={title} />
    <Box
      component="header"
      sx={{
        p: 1,
        borderBottom: 1,
        borderColor: (theme: Theme) => theme.palette.primary.main,
      }}
    >
      <Container>
        <Link href="/" passHref>
          <Typography component="a" variant="h4">
            HeadlessManager
          </Typography>
        </Link>
        <Nav />
      </Container>
    </Box>
    {children}
  </>
);

export default Layout;

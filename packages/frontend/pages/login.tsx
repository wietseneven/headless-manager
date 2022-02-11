import { Card, CardContent, CardHeader, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useCallback, useState } from 'react';
import { fetchAPI } from '../lib/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { JWT_COOKIE_KEY } from '../lib/constants';
import { NextSeo } from 'next-seo';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { handleSubmit, register } = useForm();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogin = useCallback(
    async (data) => {
      setLoading(true);
      try {
        const response = await fetchAPI(
          '/auth/local',
          {},
          {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify(data),
          }
        );
        Cookies.set(JWT_COOKIE_KEY, response.jwt);
        await router.push('/');
      } catch (e: any) {
        const message = e?.message || 'Could not login';
        enqueueSnackbar(message, { variant: 'error' });
      }
      setLoading(false);
    },
    [router, enqueueSnackbar]
  );

  return (
    <Card
      variant="outlined"
      sx={{ maxWidth: 400, mt: 20, mx: 'auto', width: 1 }}
    >
      <NextSeo title="Login" />
      <CardHeader title="Please login" />
      <CardContent
        component="form"
        onSubmit={handleSubmit(handleLogin)}
        autoComplete="username"
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField
          label="Your e-mail"
          type="email"
          variant="standard"
          {...register('identifier', { required: true })}
        />
        <TextField
          label="Password"
          type="password"
          variant="standard"
          autoComplete="current-password"
          {...register('password', { required: true })}
        />
        <LoadingButton variant="contained" type="submit" loading={loading}>
          Login
        </LoadingButton>
      </CardContent>
    </Card>
  );
};

export default LoginPage;

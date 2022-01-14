import {
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useCallback } from 'react';
import { fetchAPI } from '../lib/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { JWT_COOKIE_KEY } from '../lib/constants';

const LoginPage = () => {
  const router = useRouter();
  const { handleSubmit, register } = useForm();

  const handleLogin = useCallback(
    async (data) => {
      const response = await fetchAPI(
        '/auth/local',
        {},
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      Cookies.set(JWT_COOKIE_KEY, response.jwt);
      await router.push('/');
    },
    [router]
  );

  return (
    <Card
      variant="outlined"
      sx={{ maxWidth: 400, mt: 20, mx: 'auto', width: 1 }}
    >
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
        <Button variant="contained" type="submit">
          Login
        </Button>
      </CardContent>
    </Card>
  );
};

export default LoginPage;

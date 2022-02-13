import { Box, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useCallback, useMemo, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import slugify from 'slugify';
import { fetchAPI } from '@lib/api';
import { useSnackbar } from 'notistack';

function makeId(length: number) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ-_abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

interface Props {
  clientId?: number | null;
  onSuccess: (appId: number) => void;
}

const CreateAppForm = ({ clientId, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit, register, watch } = useForm();
  const name = watch('name');
  const uid = slugify(name || '', { lower: true });
  const key = useMemo(() => makeId(32), []);

  const doSubmit = useCallback(
    async (formData) => {
      setLoading(true);
      const allData = { ...formData, client: clientId, uid, key };
      try {
        const result = await fetchAPI('/apps', undefined, {
          method: 'POST',
          body: JSON.stringify({ data: allData }),
        });
        onSuccess(result.data.id);
      } catch (e: any) {
        enqueueSnackbar(e.message, { variant: 'error' });
      } finally {
        setLoading(false);
      }
    },
    [clientId, uid, key]
  );

  return (
    <Box
      component="form"
      sx={{ display: 'flex', flexDirection: 'column' }}
      onSubmit={handleSubmit(doSubmit)}
    >
      <TextField
        autoFocus
        margin="dense"
        id="name"
        label="Application name"
        type="text"
        fullWidth
        variant="standard"
        required
        {...register('name', { required: true })}
      />
      <TextField
        margin="dense"
        id="uid"
        label="Application UID"
        type="text"
        fullWidth
        variant="standard"
        value={uid}
        disabled
      />
      <TextField
        margin="dense"
        id="key"
        label="Application Key"
        type="text"
        fullWidth
        variant="standard"
        value={key}
        disabled
      />
      <TextField
        margin="dense"
        id="channel"
        label="Slack channel"
        type="text"
        fullWidth
        variant="standard"
        {...register('channel', { required: false })}
      />
      <TextField
        margin="dense"
        id="repository"
        label="Repository"
        type="text"
        fullWidth
        variant="standard"
        {...register('repository', { required: false })}
      />
      <LoadingButton loading={loading} sx={{ mt: 2, ml: 'auto' }} type="submit">
        Create
      </LoadingButton>
    </Box>
  );
};

export default CreateAppForm;

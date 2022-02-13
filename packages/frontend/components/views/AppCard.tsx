import {
  Card,
  CardActions,
  Button,
  CardContent,
  Typography,
  Stack,
  Paper,
} from '@mui/material';
import { IApp } from '@strapi-types';
import Link from 'next/link';
import { fetchAPI } from '@lib/api';
import { useEffect, useState } from 'react';

interface LogLevel {
  key: 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';
  label: string;
  color: string;
}

const logLevels: LogLevel[] = [
  {
    key: 'error',
    label: 'Error',
    color: '#FF0000',
  },
  {
    key: 'warn',
    label: 'Warning',
    color: 'orange',
  },
  {
    key: 'info',
    label: 'Info',
    color: 'cyan',
  },
  {
    key: 'http',
    label: 'http',
    color: 'blue',
  },
  {
    key: 'verbose',
    label: 'Verbose',
    color: 'white',
  },
  {
    key: 'debug',
    label: 'Debug',
    color: 'bluegreen',
  },
  {
    key: 'silly',
    label: 'Silly',
    color: 'green',
  },
];

interface Props {
  id: string;
  app: IApp;
}

interface StatsLabel {
  label: string;
  count: number;
}

interface StatsDay {
  date: string;
  total: number;
  error: number;
  warn: number;
  info: number;
  http: number;
  verbose: number;
  debug: number;
  silly: number;
}

interface Stats {
  total: {
    total: number;
    error?: number;
    warn?: number;
    info?: number;
    http?: number;
    verbose?: number;
    debug?: number;
    silly?: number;
  };
  labels: StatsLabel[];
  byDay: StatsDay[];
}

const AppCard = ({ id, app }: Props) => {
  const [stats, setStats] = useState<Stats | null>(null);

  const fetchAppStats = async () => {
    const statsRaw: Stats = await fetchAPI(`/apps/${id}/stats`);
    setStats(statsRaw);
  };

  useEffect(() => {
    fetchAppStats();
  }, [id]);

  const filteredLevels = logLevels.filter((l) => stats?.total[l.key]);

  return (
    <Card
      variant="outlined"
      sx={[
        { mb: 2, cursor: 'pointer', position: 'relative' },
        (theme) => {
          return {
            transition: theme.transitions.create(['background-color']),
            '&:hover': {
              bgcolor:
                theme.palette.mode === 'dark'
                  ? theme.palette.primaryDark[600]
                  : '#fff',
            },
          };
        },
      ]}
    >
      <CardContent>
        <Typography gutterBottom variant="h6" component="h3">
          {app.name}
        </Typography>
        <Stack direction="row" spacing={1}>
          {filteredLevels.map((logLevel) => (
            <Paper
              key={logLevel.key}
              sx={{ textAlign: 'center', px: 2, py: 1 }}
            >
              <Typography color={logLevel.color} variant="h5">
                {stats?.total[logLevel.key]}
              </Typography>
              <Typography>{logLevel.label}</Typography>
            </Paper>
          ))}
          {!filteredLevels.length && (
            <Paper sx={{ textAlign: 'center', px: 2, py: 1 }}>
              <Typography variant="h5">0</Typography>
              <Typography>logs in the last 24 hours</Typography>
            </Paper>
          )}
        </Stack>
      </CardContent>
      <CardActions sx={{ mt: 'auto' }}>
        <Link href={`/apps/${id}`} passHref>
          <Button
            component="a"
            sx={[
              { position: 'static', ml: 'auto' },
              { '&:before': { content: "''", position: 'absolute', inset: 0 } },
            ]}
          >
            Learn More
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default AppCard;

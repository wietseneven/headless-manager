import {
  Card,
  CardActions,
  Button,
  CardContent,
  Typography,
} from '@mui/material';
import { IApp } from '@strapi-types';
import Link from 'next/link';

interface Props {
  id: string;
  app: IApp;
}

const AppCard = ({ id, app }: Props) => {
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
      </CardContent>
      <CardActions>
        <Link href={`/projects/${id}`} passHref>
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

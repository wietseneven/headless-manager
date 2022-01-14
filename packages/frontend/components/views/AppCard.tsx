import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { IApp, IMessage } from '../../../../types';
import { fetchAPI } from '../../lib/api';
import logger from '../../lib/logger';

interface Props {
  id: string;
  app: IApp;
}

interface Message {
  id: string;
  attributes: IMessage & {
    createdAt: string;
  };
}

interface MessagesResponse {
  loading: boolean;
  data: Message[];
}

const AppCard = ({ id, app }: Props) => {
  const [messages, setMessages] = useState<MessagesResponse>({
    loading: true,
    data: [],
  });

  useEffect(() => {
    fetchAPI('/messages', {
      filters: { app: id },
      sort: ['createdAt:desc'],
    })
      .then((response) => {
        // logger.silly('Hey there!', response);
        setMessages({ loading: false, ...response });
      })
      .catch((error) => {
        logger.error(error);
      });
  }, []);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography gutterBottom variant="h2">
          {app.name}
        </Typography>
        <Card
          variant="outlined"
          sx={{
            maxHeight: 300,
            maxWidth: 400,
            ml: 'auto',
            overflow: 'auto',
            background: 'black',
            fontFamily: 'Menlo, monospace',
          }}
        >
          <Table size="small" padding="none">
            <TableBody>
              {messages.data.map((message) => (
                <TableRow key={message.id}>
                  <TableCell size="small" padding="none">{message.attributes.level}</TableCell>
                  <TableCell
                    sx={{
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {format(
                      new Date(message.attributes.createdAt),
                      'dd-MM-yy kk:mm:ss'
                    )}
                  </TableCell>
                  <TableCell>{message.attributes.message}</TableCell>
                </TableRow>
              ))}
              {!messages.loading && !messages.data.length && (
                <TableRow>
                  <TableCell
                    sx={{
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {format(new Date(), 'dd-MM-yy kk:mm:ss')}
                  </TableCell>
                  <TableCell
                    sx={{ fontFamily: 'Menlo, monospace', width: '100%' }}
                  >
                    There are no messages yet...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </CardContent>
    </Card>
  );
};

export default AppCard;

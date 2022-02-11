import { Card, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { fetchAPI } from '@lib/api';
import { IMessage } from '@strapi-types';
import InfiniteScroll from 'react-infinite-scroll-component';

interface Message {
  id: string;
  attributes: IMessage & {
    createdAt: string;
  };
}

interface MessagesResponse {
  loading: boolean;
  data: Message[];
  meta: {
    pagination: {
      page: number;
      pageCount: number;
      pageSize: number;
      total: number;
    };
  };
}

interface Props {
  id: string;
}

const AppMessages = ({ id }: Props) => {
  const [messages, setMessages] = useState<MessagesResponse>({
    loading: true,
    data: [],
    meta: {
      pagination: {
        page: 0,
        pageCount: 0,
        pageSize: 100,
        total: 0,
      },
    },
  });

  const fetchData = async () => {
    const response = await fetchAPI('/messages', {
      filters: { app: id },
      sort: ['createdAt:desc'],
      pagination: {
        page: messages.meta.pagination.page + 1,
        pageSize: messages.meta.pagination.pageSize,
      },
    });

    setMessages((prevState) => ({
      loading: false,
      ...response,
      data: [...prevState.data, ...response.data],
    }));
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <Card
      variant="outlined"
      sx={{
        overflow: 'auto',
        background: 'black',
        maxHeight: '80vh',
        fontFamily: 'Menlo, monospace',
      }}
    >
      <InfiniteScroll
        dataLength={messages.data.length}
        next={fetchData}
        style={{ display: 'flex', flexDirection: 'column' }} // To put endMessage and loader to the top.
        hasMore={
          messages.meta.pagination.page < messages.meta.pagination.pageCount
        }
        loader={<h4>Loading...</h4>}
      >
        <Table size="small" padding="none">
          <TableBody>
            {messages.data.map((message) => (
              <TableRow key={message.id}>
                <TableCell sx={{ paddingRight: 0 }}>
                  {message.attributes.level}
                </TableCell>
                <TableCell
                  sx={{
                    paddingRight: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {format(
                    new Date(message.attributes.createdAt),
                    'dd-MM-yy kk:mm:ss'
                  )}
                </TableCell>
                <TableCell sx={{ paddingRight: 0 }}>
                  {message.attributes.label}
                </TableCell>
                <TableCell sx={{ paddingRight: 0, width: '100%' }}>
                  {message.attributes.message}
                </TableCell>
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
      </InfiniteScroll>
    </Card>
  );
};

export default AppMessages;

import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { fetchAPI } from '@lib/api';
import { IMessage } from '@strapi-types';
import {
  DataGrid,
  GridFilterModel,
  GridColDef,
  GridSortModel,
} from '@mui/x-data-grid';

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

const operatorValues = {
  '>': '$gt',
  '>=': '$gte',
  '<': '$lt',
  '<=': '$lte',
  is: '$eq',
  contains: '$contains',
  isEmpty: '$null',
  isNotEmpty: '$notNull',
  isAnyOf: '$in',
  startsWith: '$startsWith',
  endWith: '$endsWith',
};

const columns: GridColDef[] = [
  { field: 'level', headerName: 'Level', width: 100 },
  { field: 'createdAt', headerName: 'Timestamp', width: 150 },
  { field: 'label', headerName: 'Label', width: 150 },
  { field: 'message', headerName: 'Message', width: 600 },
];

const AppMessages = ({ id }: Props) => {
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'createdAt', sort: 'desc' },
  ]);
  const [page, setPage] = useState<number>(0);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });
  const [messages, setMessages] = useState<MessagesResponse>({
    loading: true,
    data: [],
    meta: {
      pagination: {
        page: 1,
        pageCount: 0,
        pageSize: 100,
        total: 0,
      },
    },
  });

  const fetchData = async () => {
    setMessages((prevState) => ({ ...prevState, loading: true }));
    const sortArr = sortModel.map((model) => `${model.field}:${model.sort}`);

    const filters = filterModel.items.reduce(
      (acc, filter) => {
        // @ts-ignore
        const operator = operatorValues[filter.operatorValue];
        if (!operator) {
          throw new Error(`Unknown operatorValue: ${filter.operatorValue}!`);
        }
        return {
          ...acc,
          [filter.columnField]: {
            [operator]: filter.value ? filter.value : true,
          },
        };
      },
      { app: id }
    );

    const response = await fetchAPI('/messages', {
      filters,
      sort: sortArr,
      pagination: {
        page: page || messages.meta.pagination.page,
        pageSize: messages.meta.pagination.pageSize,
      },
    });

    setMessages((prevState) => ({
      loading: false,
      ...response,
      data: response.data.map((message: Message) => ({
        id: message.id,
        createdAt: format(
          new Date(message.attributes.createdAt),
          'dd-MM-yy kk:mm:ss'
        ),
        level: message.attributes.level,
        label: message.attributes.label,
        message: message.attributes.message,
      })),
    }));
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortModel, filterModel]);

  return (
    <div style={{ backgroundColor: '#000', height: '80vh', width: '100%' }}>
      <DataGrid
        rows={messages.data}
        columns={columns}
        paginationMode="server"
        rowCount={messages.meta.pagination.total}
        page={page}
        loading={messages.loading}
        onPageChange={setPage}
        filterMode="server"
        onFilterModelChange={setFilterModel}
        filterModel={filterModel}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={setSortModel}
      />
    </div>
  );
};

export default AppMessages;

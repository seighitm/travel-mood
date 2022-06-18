import { ScrollArea, Stack } from '@mantine/core';
import * as React from 'react';

import Table from './Users';
import TableInput from '../../common/table/table-input';
import TablePagination from '../../common/table/table-pagination';
import tableStore from '../../../store/table.store';
import { useGetUsersWithAdminRole } from '../../../api/admin/queries';

const WrapperTableTrips = () => {
  const {
    queryPageIndex,
    queryPageSize,
    queryPageFilter,
    queryPageSortBy,
    queryPageOrder,
    setPageIndex,
    setPageFilter,
    setPageSortBy,
    setPageOrder,
  } = tableStore((state: any) => state);

  const { data, refetch, isFetching, isFetched, isError } = useGetUsersWithAdminRole(
    queryPageIndex,
    queryPageSize,
    queryPageFilter,
    queryPageSortBy,
    queryPageOrder
  );

  return (
    <>
      {data && (
        <Stack>
          <TableInput value={queryPageFilter} onChange={setPageFilter} isFetched={isFetched} />
          <ScrollArea pb={'lg'}>
            <Table
              columns={columns}
              data={data}
              isError={isError}
              isFetching={isFetching}
              queryPageIndex={queryPageIndex}
              queryPageSize={queryPageSize}
              queryPageFilter={queryPageFilter}
              setPageFilter={setPageFilter}
              queryPageSortBy={queryPageSortBy}
              queryPageOrder={queryPageOrder}
              setPageIndex={setPageIndex}
              setPageOrder={setPageOrder}
              setPageSortBy={setPageSortBy}
            />
          </ScrollArea>
          <TablePagination
            refetch={refetch}
            page={queryPageIndex}
            onChange={setPageIndex}
            total={Math.ceil(data.count / queryPageSize)}
          />
        </Stack>
      )}
    </>
  );
};

export default WrapperTableTrips;

const columns = [
  {
    Header: 'name',
    accessor: 'name',
  },
  {
    Header: 'email',
    accessor: 'email',
  },
  {
    Header: 'rating',
    accessor: 'rating',
  },
  {
    Header: 'articles',
    accessor: 'articlesCount',
  },
  {
    Header: 'trips',
    accessor: 'tripsCount',
  },
];

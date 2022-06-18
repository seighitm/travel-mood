import { Button, Group, ScrollArea, Stack } from '@mantine/core';
import * as React from 'react';

import Table from './Trips';
import TableInput from '../../common/table/table-input';
import TablePagination from '../../common/table/table-pagination';
import tableStore from '../../../store/table.store';
import { useGetTripsForAdmin } from '../../../api/admin/queries';
import { useNavigate } from 'react-router-dom';
import { CirclePlus } from '../../common/Icons';

const WrapperTableTrips = () => {
  const navigate = useNavigate();

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

  const { data, refetch, isFetching, isFetched, isError } = useGetTripsForAdmin(
    queryPageIndex,
    queryPageSize,
    queryPageFilter,
    queryPageSortBy,
    queryPageOrder
  );
  return (
    <>
      <Group mb={'sm'} style={{ width: '100%' }} position={'right'}>
        <Button
          compact
          color={'pink'}
          leftIcon={<CirclePlus size={17} />}
          onClick={() => {
            navigate('/admin/trips/add');
          }}
        >
          Add Trip
        </Button>
      </Group>
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
    </>
  );
};

export default WrapperTableTrips;

const columns = [
  {
    Header: 'title',
    accessor: 'title',
  },
  {
    Header: 'author',
    accessor: 'author',
  },
  {
    Header: 'date',
    accessor: 'date',
  },
  {
    Header: 'likes',
    accessor: 'likes',
  },
  {
    Header: 'comments',
    accessor: 'comments',
  },
];

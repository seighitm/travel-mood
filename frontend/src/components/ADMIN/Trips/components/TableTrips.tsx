import {Button, ScrollArea, Stack} from "@mantine/core";
import * as React from "react";

import Table from "../components/table";
import TableInput from "../../../common/table/table-input";
import TablePagination from "../../../common/table/table-pagination";
import tableStore from "../../../../store/table.store";
import {useTripsFiltering} from "../../../../api/trips/queries";
import {FilePlusIcon} from "@modulz/radix-icons";
import {useNavigate} from "react-router-dom";

const TableTrips = () => {
  const navigate = useNavigate()

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

  const {data, refetch, isFetching, isFetched, isError} = useTripsFiltering(
    queryPageIndex,
    queryPageSize,
    queryPageFilter,
    queryPageSortBy,
    queryPageOrder,
  );
  return <>
    <Button
      compact
      color={'pink'}
      leftIcon={<FilePlusIcon style={{width: '17px', height: '17px'}}/>}
      onClick={() => {
        navigate('/admin/trips/add')
      }}
    >
      Add Trip
    </Button>
    <Stack>
      <TableInput
        value={queryPageFilter}
        onChange={setPageFilter}
        isFetched={isFetched}
      />
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
};

export default TableTrips;

const columns = [
  {
    Header: "ID",
    accessor: "id",
  },
  {
    Header: "title",
    accessor: "title",
  },
  {
    Header: "author",
    accessor: "author",
  },
  {
    Header: "date",
    accessor: "date",
  },
  {
    Header: "likes",
    accessor: "likes",
  },
  {
    Header: "comments",
    accessor: "comments",
  },
];

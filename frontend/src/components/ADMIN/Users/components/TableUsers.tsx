import {Button, Group, Modal, ScrollArea, Stack, Text} from "@mantine/core";
import * as React from "react";

import Table from "../components/table";
import TableInput from "../../../common/tableComponents/table-input";
import TablePagination from "../../../common/tableComponents/table-pagination";
import tableStore from "../../../../store/table.store";
import {useTripsFiltering} from "../../../../api/trips/queries";
import {getUsersWithAdminRole} from "../../../../api/users/axios";
import {useGetUsersWithAdminRole} from "../../../../api/users/queries";
import {Calendar} from "@mantine/dates";
import {useState} from "react";
import {useUserAccountBlock} from "../../../../api/users/mutations";

const TableTrips = () => {
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

  const {data, refetch, isFetching, isFetched, isError} = useGetUsersWithAdminRole(
    queryPageIndex,
    queryPageSize,
    queryPageFilter,
    queryPageSortBy,
    queryPageOrder,
  );


  return (
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
  );
};

export default TableTrips;

const columns = [
  {
    Header: "id",
    accessor: "id",
  },
  {
    Header: "name",
    accessor: "name",
  },
  {
    Header: "email",
    accessor: "email",
  },
  {
    Header: "rating",
    accessor: "rating",
  },
];

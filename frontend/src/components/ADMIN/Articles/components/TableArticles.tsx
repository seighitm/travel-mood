import {ScrollArea, Stack} from "@mantine/core";
import * as React from "react";

import Table from "../components/table";
import TableInput from "../../../common/tableComponents/table-input";
import TablePagination from "../../../common/tableComponents/table-pagination";
import tableStore from "../../../../store/table.store";
import {useTripsFiltering} from "../../../../api/trips/queries";
import {useEffect} from "react";
import {useArticlesFiltering} from "../../../../api/articles/queries";

const TableArticles = () => {
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

  const {data, refetch, isFetching, isFetched, isError} = useArticlesFiltering(
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

export default TableArticles;

const columns = [
  {
    Header: "id",
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

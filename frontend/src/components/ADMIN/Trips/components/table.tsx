import {ActionIcon, Button, createStyles, Skeleton, Table as MantineTable, Text,} from "@mantine/core";
import * as React from "react";
import {usePagination, useSortBy, useTable} from "react-table";

import SortingIcon from "../../../common/tableComponents/sorting-icon";
import handleSortBy from "../../../common/tableComponents/handle-sort-by";
import {useMutationDeleteTrip} from "../../../../api/trips/mutations";
import {dateFormatedToIsoString} from "../../../common/Utils";
import {Trash} from "../../../../assets/Icons";
import {useNavigate} from "react-router-dom";

const Table = ({
                 columns,
                 data,
                 isFetching,
                 queryPageIndex,
                 queryPageSize,
                 queryPageFilter,
                 queryPageSortBy,
                 queryPageOrder,
                 setPageIndex,
                 setPageOrder,
                 setPageSortBy,
               }: any) => {
  const {classes} = useStyles();

  const {mutate: mutateDeleteTrip} = useMutationDeleteTrip(() => console.log('YEEEES'));


  const tableColumns = React.useMemo(() => columns, [columns]);
  const tableData = React.useMemo(() => data, [data]);

  const {getTableProps, getTableBodyProps, headerGroups, prepareRow, page}: any =
    useTable(
      {
        columns: tableColumns,
        data: tableData?.trips ?? [],
        initialState: {
          // @ts-ignore
          pageIndex: queryPageIndex,
          pageSize: queryPageSize,
        },
        useControlledState,
        manualPagination: true, // We will handle pagination manually
        pageCount: tableData?.count ?? null,
        setQueryPageIndex: queryPageIndex,
        setQueryPageSize: queryPageSize,
        manualSortBy: true, // We will handle sorting manually
        defaultCanSort: true,
      },
      useSortBy,
      usePagination
    );

  /* Controll the table state manually
   * since pagination, filtering and ordering are done server-side */
  function useControlledState(state: any) {
    return React.useMemo(
      () => ({
        ...state,
        pageIndex: queryPageIndex,
        pageSize: queryPageSize,
      }),
      [state]
    );
  }

  const onHandleSortBy = (column: any) => () =>
    handleSortBy(
      column,
      queryPageSortBy,
      queryPageOrder,
      setPageSortBy,
      setPageOrder
    );

  /* reset the page index to 1 and page order to 'none'
   * when you start typing in the input field
   * while you're not on the first page
   */
  React.useEffect(() => {
    setPageOrder("none");
    setPageIndex(1);
  }, [queryPageFilter, setPageOrder, setPageIndex]);

  /* reset to page index 1
   * when the sorting changes
   */
  React.useEffect(() => {
    setPageIndex(1);
  }, [queryPageSortBy, setPageIndex]);

  const checkColumnTitle = (cell: any, title: string) => {
    return cell.getCellProps().key.split('_').reverse()[0] == title
  }
  const navigate = useNavigate()

  return (
    <MantineTable
      verticalSpacing={"xs"}
      horizontalSpacing={"md"}
      className={classes.table}
      {...getTableProps()}>
      <thead style={{width: '0%!important'}}>
      {headerGroups.map((headerGroup: any, index: any) => (
        <tr {...headerGroup.getHeaderGroupProps()} style={{width: '0%!important'}} key={index}>
          {headerGroup.headers.map((column: any) => (
            <th
              {...column.getHeaderProps(column.getSortByToggleProps())}
              key={column.id}
              style={{width: '0%!important'}}
              onClick={onHandleSortBy(column)}>
              <Button variant={'subtle'} compact rightIcon={SortingIcon(column.id, queryPageSortBy, queryPageOrder)}>
                {column.render("Header")}
              </Button>
            </th>
          ))}
        </tr>
      ))}
      </thead>
      <tbody {...getTableBodyProps()}>
      {page.map((row: any) => {
        prepareRow(row);
        console.log(row.cells[0].getCellProps())
        return (
          <tr {...row.getRowProps()} key={row.id}>
            {row.cells.map((cell: any, index: any) => (
              <>
                <td {...cell.getCellProps()} style={{width: '0%!important'}} key={index}>
                  {checkColumnTitle(cell, 'title')
                    ? <Button compact variant={'subtle'} onClick={() => navigate('/trip/' + row.original.id)}>
                      {cell.render("Cell")}
                    </Button>
                    : <Text lineClamp={checkColumnTitle(cell, 'title') ? 1 : undefined}
                            styles={{root: {width: checkColumnTitle(cell, 'title') ? '150px' : ''}}}>
                      {isFetching
                        ? <Skeleton height={28}/>
                        : checkColumnTitle(cell, 'date')
                          ? dateFormatedToIsoString(cell.row.original.createdAt)
                          : cell.render("Cell")
                      }
                    </Text>
                  }
                </td>
              </>
            ))}
            <td style={{width: '0%!important'}}>
              <ActionIcon color={'red'} onClick={() => mutateDeleteTrip(row.original.id)}>
                <Trash size={20}/>
              </ActionIcon>
            </td>
          </tr>
        );
      })}
      </tbody>
    </MantineTable>
  );
};

export default Table;

const useStyles = createStyles((theme) => ({
  table: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    borderRadius: "0.25rem",
    overflow: "hidden",
    boxShadow: theme.shadows.xs,
    // "& th": {
    //   backgroundColor:
    //     theme.colorScheme === "dark"
    //       ? theme.colors.dark[6]
    //       : theme.colors.gray[0],
    // },
  },
}));

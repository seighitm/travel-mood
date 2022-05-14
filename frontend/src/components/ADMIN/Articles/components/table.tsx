import {
  ActionIcon,
  Button,
  createStyles,
  Skeleton,
  Table as MantineTable,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import * as React from "react";
import {usePagination, useSortBy, useTable} from "react-table";

import SortingIcon from "../../../common/tableComponents/sorting-icon";
import handleSortBy from "../../../common/tableComponents/handle-sort-by";
import {useMutationDeleteTrip} from "../../../../api/trips/mutations";
import {dateFormatedToIsoString} from "../../../common/Utils";
import {Trash} from "../../../../assets/Icons";
import {useNavigate} from "react-router-dom";
import ConfirmationModal from "../../ConfirmationModal";
import {useMutationDeleteArticle} from "../../../../api/articles/mutations";
import {useDisclosure} from "@mantine/hooks";
import {useState} from "react";

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
  console.log(data)
  const {mutate: mutateDeleteTrip} = useMutationDeleteTrip(() => console.log('YEEEES'));


  const tableColumns = React.useMemo(() => columns, [columns]);
  const tableData = React.useMemo(() => data, [data]);

  const {getTableProps, getTableBodyProps, headerGroups, prepareRow, page}: any =
    useTable(
      {
        columns: tableColumns,
        data: tableData?.articles ?? [],
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

  const [openedDeleteArticleModal, handlersDeleteArticleModal] = useDisclosure(false);
  const [selectedArticleId, setSelectedArticleId] = useState<any>(-1)

  const navigate = useNavigate()
  const theme = useMantineTheme()

  const onSuccessEvent = () => {
    handlersDeleteArticleModal.close()
    setSelectedArticleId(-1)
  }

  const {mutate: mutateDeleteArticle} = useMutationDeleteArticle({
    onSuccessEvent: onSuccessEvent
  });
  console.log(window.location.href.split('/').reverse()[1])
  return (
    <>
      <ConfirmationModal
        handler={() => mutateDeleteArticle(selectedArticleId)}
        isOpenModal={openedDeleteArticleModal}
        modalHandler={handlersDeleteArticleModal}
      />
      <MantineTable
        striped
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
                  <td {...cell.getCellProps()} style={{width: '0px!important'}} key={index}>
                    {checkColumnTitle(cell, 'title')
                      ? <UnstyledButton style={{width: '47%', color: theme.colors.blue[6]}}
                                        onClick={() => navigate('/trip/' + row.original.id)}>
                        <Text lineClamp={1} styles={{root: {width: checkColumnTitle(cell, 'title') ? '100px' : ''}}}>
                          {cell.render("Cell")}
                        </Text>
                      </UnstyledButton>
                      : <Text lineClamp={checkColumnTitle(cell, 'title') ? 1 : undefined}
                              styles={{root: {width: checkColumnTitle(cell, 'id') ? '33px!important' : ''}}}
                      >
                        {isFetching
                          ? <Skeleton height={28}/>
                          : checkColumnTitle(cell, 'date')
                            ? dateFormatedToIsoString(cell.row.original.date)
                            : cell.render("Cell")
                        }
                      </Text>
                    }
                  </td>
                </>
              ))}
              <td style={{width: '0%!important'}}>
                <ActionIcon
                  size={'sm'}
                  color={'red'}
                  onClick={() => {
                    setSelectedArticleId(row.original.id)
                    handlersDeleteArticleModal.open()
                  }}
                >
                  <Trash size={20}/>
                </ActionIcon>
              </td>
            </tr>
          );
        })}
        </tbody>
      </MantineTable>
    </>
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

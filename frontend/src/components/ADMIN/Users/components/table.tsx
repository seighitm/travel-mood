import {ActionIcon, Button, createStyles, Group, Modal, Skeleton, Table as MantineTable, Text,} from "@mantine/core";
import * as React from "react";
import {useEffect, useState} from "react";
import {usePagination, useSortBy, useTable} from "react-table";

import SortingIcon from "../../../common/tableComponents/sorting-icon";
import handleSortBy from "../../../common/tableComponents/handle-sort-by";
import {dateFormatedToIsoString} from "../../../common/Utils";
import {Calendar} from "@mantine/dates";
import {useMutateSwitchUserRole, useUserAccountActivate, useUserAccountBlock} from "../../../../api/users/mutations";
import {Circle, Trash} from "../../../../assets/Icons";
import {ArrowDownIcon, ArrowUpIcon, ChatBubbleIcon, LockClosedIcon, LockOpen1Icon} from "@modulz/radix-icons";
import {useMutateAccessChat} from "../../../../api/chat/mutations";
import {useNavigate} from "react-router-dom";
import useStore from "../../../../store/user.store";

const TableUsers = ({
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

  const tableColumns = React.useMemo(() => columns, [columns]);
  const tableData = React.useMemo(() => data, [data]);

  const {getTableProps, getTableBodyProps, headerGroups, prepareRow, page}: any =
    useTable(
      {
        columns: tableColumns,
        data: tableData.users ?? [],
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

  const {user, onlineUsers} = useStore((state: any) => state);

  const [modalType, setModalType] = useState<any>(null);
  const [value, setValue] = useState<any>(null);
  const {mutate: mutateBlockUser, isLoading: isLoadingBlockUserMutation} = useUserAccountBlock();
  const [selectedUserId, setSelectedUserId] = useState<any>(null)
  const {
    mutate: mutateAccessChat,
    isSuccess: isSuccessAccessChat
  } = useMutateAccessChat();
  const navigate = useNavigate()

  const {
    mutate: mutateActivateUserAccount,
    isLoading: isLoadingActivateUserAccountMutation
  } = useUserAccountActivate();
  const {mutate: mutateSwitchRole, isLoading: isLoadingSwitchRoleMutation} = useMutateSwitchUserRole();

  useEffect(() => {
    if (isSuccessAccessChat)
      navigate('/chat')
  }, [isSuccessAccessChat])

  return (
    <>
      <Modal
        style={{}}
        opened={modalType != null}
        onClose={() => setModalType(null)}
        centered
        withCloseButton={false}
        styles={(theme) => ({
          modal: {
            width: 'auto'
          }
        })}
      >
        {modalType == 'ACTIVE'
          ? <>
            <Text size={'xl'}>
              You are sure ?
            </Text>
          </>
          : <>
            <Calendar value={value} onChange={setValue}/>
            <Group mt={'sm'} position={'center'}>
              <Button compact onClick={() => {
                mutateBlockUser({userId: selectedUserId, expiredBlockDate: value})
                setModalType(null)
              }}>
                Block
              </Button>
            </Group>
          </>
        }
      </Modal>
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
          ``
          prepareRow(row);
          console.log(row)
          return (
            <tr {...row.getRowProps()} key={row.id}>
              {row.cells.map((cell: any, index: any) => (
                <>
                  <td {...cell.getCellProps()} style={{width: '0%!important'}} key={index}>
                    {checkColumnTitle(cell, 'name')
                      ? <Button compact leftIcon={
                        <ActionIcon size={10} variant={'filled'}
                                    color={onlineUsers[row.original.id] ? 'green' : 'red'} radius={'xl'}>
                          <Circle/>
                        </ActionIcon>
                      } variant={'subtle'} onClick={() => navigate('/user/' + row.original.id)}>
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
                <ActionIcon
                  variant={'filled'}
                  color={'teal'}
                  onClick={() => {
                    mutateAccessChat(row.original.id)
                  }}
                >
                  <ChatBubbleIcon/>
                </ActionIcon>
              </td>
              <td style={{width: '0%!important'}}>
                <ActionIcon
                  variant={'filled'}
                  color={row.original.activatedStatus == 'ACTIVATED' ? 'red' : ''}
                  onClick={
                    row.original.activatedStatus == 'ACTIVATED'
                      ? () => {
                        setSelectedUserId(row.original.id)
                        setModalType(row.original.activatedStatus == 'ACTIVATED' ? 'BLOCK' : 'ACTIVE')
                      } : () => {
                        mutateActivateUserAccount({userId: row.original.id})
                      }
                  }
                >
                  {row.original.activatedStatus == 'ACTIVATED' ? <LockClosedIcon/> : <LockOpen1Icon/>}
                </ActionIcon>
              </td>
              <td style={{width: '0%!important'}}>
                <ActionIcon variant={'filled'}
                            color={row.original.role.role == 'ADMIN' ? 'pink' : 'blue'}
                            onClick={() => mutateSwitchRole({userId: row.original.id})}
                >
                  {row.original.role.role == 'ADMIN' ? <ArrowDownIcon/> : <ArrowUpIcon/>}
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

export default TableUsers;

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

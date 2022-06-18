import {
  ActionIcon,
  Avatar,
  Button,
  Center,
  createStyles,
  Group,
  Menu,
  RingProgress,
  Skeleton,
  Table as MantineTable,
  Text,
} from '@mantine/core';
import * as React from 'react';
import {useState} from 'react';
import {usePagination, useSortBy, useTable} from 'react-table';

import SortingIcon from '../../common/table/sorting-icon';
import handleSortBy from '../../common/table/handle-sort-by';
import {useMutateSwitchUserRole, useUserAccountActivate} from '../../../api/admin/mutations';
import {ArrowDown, ArrowUp, Lock, LockOpen, MessageDots} from '../../common/Icons';
import {useMutateAccessChat} from '../../../api/chat/mutations';
import {useNavigate} from 'react-router-dom';
import useStore from '../../../store/user.store';
import {ACCOUNT_STATUS, ROLE} from '../../../types/enums';
import {useMediaQuery} from '@mantine/hooks';
import ModalBlockUser from './ModalBlockUser';
import ConfirmationModal from '../../common/ConfirmationModal';
import {dateFormattedToIsoString, userPicture} from '../../../utils/utils-func';
import {MD_ICON_SIZE} from '../../../utils/constants';

const useStyles = createStyles((theme) => ({
  table: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    borderRadius: '0.25rem',
    overflow: 'hidden',
    boxShadow: theme.shadows.xs,
  },
}));

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
  const navigate = useNavigate();
  const tableColumns = React.useMemo(() => columns, [columns]);
  const tableData = React.useMemo(() => data, [data]);
  const {onlineUsers} = useStore((state: any) => state);
  const mobile = useMediaQuery('(min-width: 615px)');

  // const [modalType, setModalType] = useState<any>(null);
  const [selectedUserId, setSelectedUserId] = useState<any>(null);
  const [isOpenedSwitchRoleConfirmationModal, setIsOpenedSwitchRoleConfirmationModal] =
    useState(false);
  const [isOpenedActivationConfirmationModal, setIsOpenedActivationConfirmationModal] =
    useState(false);
  const [isOpenedBlockModal, setIsOpenedBlockModal] = useState<boolean>(false);

  const {mutate: mutateAccessChat, isSuccess: isSuccessAccessChat} = useMutateAccessChat();
  const {mutate: mutateActivateUserAccount, isLoading: isLoadingActivateUserAccount} =
    useUserAccountActivate();
  const {mutate: mutateSwitchRole, isLoading: isLoadingSwitchRole} = useMutateSwitchUserRole();

  const {getTableProps, getTableBodyProps, headerGroups, prepareRow, page}: any = useTable(
    {
      columns: tableColumns,
      data: tableData.users ?? [],
      initialState: {
        // @ts-ignore
        pageIndex: queryPageIndex,
        pageSize: queryPageSize,
      },
      useControlledState,
      manualPagination: true,
      pageCount: tableData?.count ?? null,
      setQueryPageIndex: queryPageIndex,
      setQueryPageSize: queryPageSize,
      manualSortBy: true,
      defaultCanSort: true,
    },
    useSortBy,
    usePagination
  );

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

  const onHandleSortBy = (column: any) => () => {
    handleSortBy(column, queryPageSortBy, queryPageOrder, setPageSortBy, setPageOrder);
  };

  React.useEffect(() => {
    setPageOrder('none');
    setPageIndex(1);
  }, [queryPageFilter, setPageOrder, setPageIndex]);

  React.useEffect(() => {
    setPageIndex(1);
  }, [queryPageSortBy, setPageIndex]);

  const checkColumnTitle = (cell: any, title: string) => {
    return cell.getCellProps().key.split('_').reverse()[0] == title;
  };

  return (
    <>
      <ModalBlockUser
        isOpenedBlockModal={isOpenedBlockModal}
        setIsOpenedBlockModal={setIsOpenedBlockModal}
        selectedUserId={selectedUserId}
      />
      <ConfirmationModal
        key={'role'}
        openedConfirmationModal={isOpenedSwitchRoleConfirmationModal}
        setOpenedConfirmationModal={setIsOpenedSwitchRoleConfirmationModal}
        handlerSubmit={() => {
          mutateSwitchRole({userId: selectedUserId});
          setSelectedUserId(null);
        }}
      />
      <ConfirmationModal
        key={'activation'}
        openedConfirmationModal={isOpenedActivationConfirmationModal}
        setOpenedConfirmationModal={setIsOpenedActivationConfirmationModal}
        handlerSubmit={() => {
          mutateActivateUserAccount({userId: selectedUserId});
          setSelectedUserId(null);
        }}
      />
      <MantineTable
        verticalSpacing={'xs'}
        horizontalSpacing={'md'}
        className={classes.table}
        {...getTableProps()}
      >
        <thead style={{width: '0%!important'}}>
        {headerGroups.map((headerGroup: any, index: any) => (
          <tr
            {...headerGroup.getHeaderGroupProps()}
            style={{width: '0%!important'}}
            key={index}
          >
            {headerGroup.headers.map((column: any) => (
              <th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                key={column.id}
                style={{width: ['name'].includes(column.Header) ? '0%!important' : '1px'}}
                onClick={onHandleSortBy(column)}
              >
                <Button
                  variant={'subtle'}
                  compact
                  rightIcon={SortingIcon(column.id, queryPageSortBy, queryPageOrder)}
                >
                  {column.render('Header')?.toUpperCase()}
                </Button>
              </th>
            ))}
          </tr>
        ))}
        </thead>
        <tbody {...getTableBodyProps()}>
        {page.map((row: any) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={row.id}>
              {row.cells.map((cell: any, index: any) => (
                <>
                  <td {...cell.getCellProps()} style={{width: '0%!important'}} key={index}>
                    {checkColumnTitle(cell, 'name') ? (
                      <>
                        {isFetching ? (
                          <Group direction={'row'}>
                            <Skeleton height={28} circle/>
                            <Skeleton height={28} width={70}/>
                          </Group>
                        ) : (
                          <Group direction={!mobile ? 'column' : 'row'} spacing="sm">
                            <RingProgress
                              style={{cursor: 'pointer'}}
                              onClick={() => navigate('/admin/users/' + row.original.id)}
                              thickness={2}
                              size={40}
                              roundCaps
                              sections={[
                                {
                                  value: 100,
                                  color: onlineUsers[row.original.id] ? 'green' : 'red',
                                },
                              ]}
                              label={
                                <Center style={{position: 'relative'}}>
                                  <Avatar
                                    size={MD_ICON_SIZE}
                                    src={userPicture(cell.row.original)}
                                    radius={30}
                                  />
                                </Center>
                              }
                            />
                            <div onClick={() => navigate('/admin/users/' + row.original?.id)}>
                              <Text style={{cursor: 'pointer'}} size="sm" weight={500}>
                                {cell.render('Cell')}
                              </Text>
                              <Text style={{cursor: 'pointer'}} color="dimmed" size="xs">
                                {cell.row.original?.role.role}
                              </Text>
                            </div>
                          </Group>
                        )}
                      </>
                    ) : (
                      <Text
                        lineClamp={checkColumnTitle(cell, 'title') ? 1 : undefined}
                        styles={{
                          root: {width: checkColumnTitle(cell, 'title') ? '150px' : ''},
                        }}
                      >
                        {isFetching ? (
                          <Skeleton height={28}/>
                        ) : checkColumnTitle(cell, 'date') ? (
                          dateFormattedToIsoString(cell.row.original.createdAt)
                        ) : (
                          cell.render('Cell')
                        )}
                      </Text>
                    )}
                  </td>
                </>
              ))}
              <td style={{width: '1px'}}>
                <Group spacing={0} position="right">
                  <Menu size={'sm'} transition="pop" withArrow placement="end">
                    <Menu.Item
                      onClick={() => mutateAccessChat(row.original.id)}
                      color={'teal'}
                      p={'xs'}
                      icon={
                        <ActionIcon size={'xs'} variant={'transparent'} color={'teal'}>
                          <MessageDots size={MD_ICON_SIZE}/>
                        </ActionIcon>
                      }
                    >
                      Chat
                    </Menu.Item>
                    {row.original.role.role != ROLE.ADMIN &&
                      <Menu.Item
                        p={'xs'}
                        color={
                          row.original.activatedStatus == ACCOUNT_STATUS.ACTIVATED ? 'red' : 'blue'
                        }
                        onClick={
                          row.original.activatedStatus == ACCOUNT_STATUS.ACTIVATED
                            ? () => {
                              setSelectedUserId(row.original.id);
                              setIsOpenedBlockModal(true);
                            }
                            : () => {
                              setSelectedUserId(row.original.id);
                              setIsOpenedActivationConfirmationModal(true);
                            }
                        }
                        icon={
                          <ActionIcon
                            size={'xs'}
                            loading={isLoadingActivateUserAccount}
                            variant={'transparent'}
                            color={
                              row.original.activatedStatus == ACCOUNT_STATUS.ACTIVATED
                                ? 'red'
                                : 'blue'
                            }
                          >
                            {row.original.activatedStatus == ACCOUNT_STATUS.ACTIVATED ? (
                              <Lock size={MD_ICON_SIZE}/>
                            ) : (
                              <LockOpen size={MD_ICON_SIZE}/>
                            )}
                          </ActionIcon>
                        }
                      >
                        {row.original.activatedStatus == ACCOUNT_STATUS.ACTIVATED
                          ? 'Block'
                          : 'Activate'}
                      </Menu.Item>
                    }
                    {row.original.role.role != ROLE.ADMIN &&
                      <Menu.Item
                        p={'xs'}
                        color={row.original.role.role == ROLE.MODERATOR ? 'pink' : 'blue'}
                        onClick={() => {
                          setSelectedUserId(row.original.id);
                          setIsOpenedSwitchRoleConfirmationModal(true);
                        }}
                        icon={
                          <ActionIcon
                            size={'xs'}
                            loading={isLoadingSwitchRole}
                            variant={'transparent'}
                            color={row.original.role.role == ROLE.MODERATOR ? 'pink' : 'blue'}
                          >
                            {row.original.role.role == ROLE.MODERATOR ? (
                              <ArrowDown size={MD_ICON_SIZE}/>
                            ) : (
                              <ArrowUp size={MD_ICON_SIZE}/>
                            )}
                          </ActionIcon>
                        }
                      >
                        To {row.original.role.role == ROLE.MODERATOR ? 'user' : 'moderator'}
                      </Menu.Item>
                    }
                  </Menu>
                </Group>
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

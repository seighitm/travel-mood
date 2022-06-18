import {
  ActionIcon,
  Badge,
  Button,
  createStyles,
  Group,
  Menu,
  Skeleton,
  Table as MantineTable,
  Text,
} from '@mantine/core';
import * as React from 'react';
import { useState } from 'react';
import { usePagination, useSortBy, useTable } from 'react-table';

import SortingIcon from '../../common/table/sorting-icon';
import handleSortBy from '../../common/table/handle-sort-by';
import { useMutationDeleteTrip } from '../../../api/trips/mutations';
import { Pencil, Trash } from '../../common/Icons';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../common/ConfirmationModal';
import { dateFormattedToIsoString } from '../../../utils/utils-func';
import { MD_ICON_SIZE } from '../../../utils/constants';

const useStyles = createStyles((theme) => ({
  table: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    borderRadius: '0.25rem',
    overflow: 'hidden',
    boxShadow: theme.shadows.xs,
  },
}));

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
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { mutate: mutateDeleteTrip } = useMutationDeleteTrip();
  const tableColumns = React.useMemo(() => columns, [columns]);
  const tableData = React.useMemo(() => data, [data]);
  const [isOpenedDeleteConfirmationModal, setOpenedDeleteConfirmationModal] = useState<any>(false);
  const [selectedArticleId, setSelectedArticleId] = useState<any>(-1);

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page }: any = useTable(
    {
      columns: tableColumns,
      data: tableData?.trips ?? [],
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

  const onHandleSortBy = (column: any) => () =>
    handleSortBy(column, queryPageSortBy, queryPageOrder, setPageSortBy, setPageOrder);

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
      <ConfirmationModal
        openedConfirmationModal={isOpenedDeleteConfirmationModal}
        setOpenedConfirmationModal={setOpenedDeleteConfirmationModal}
        handlerSubmit={() => mutateDeleteTrip(selectedArticleId)}
      />
      <MantineTable
        verticalSpacing={'xs'}
        horizontalSpacing={'md'}
        className={classes.table}
        {...getTableProps()}
      >
        <thead style={{ width: '0%!important' }}>
          {headerGroups.map((headerGroup: any, index: any) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              style={{ width: '0%!important' }}
              key={index}
            >
              {headerGroup.headers.map((column: any) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={column.id}
                  style={{ width: ['title'].includes(column.Header) ? '0%!important' : '1px' }}
                  onClick={onHandleSortBy(column)}
                >
                  <Button
                    variant={'subtle'}
                    compact
                    rightIcon={SortingIcon(column.id, queryPageSortBy, queryPageOrder)}
                  >
                    {column.render('Header')}
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
                    <td {...cell.getCellProps()} style={{ width: '0%!important' }} key={index}>
                      {checkColumnTitle(cell, 'title') ? (
                        <Badge
                          radius={'md'}
                          m={0}
                          size={'lg'}
                          onClick={() => navigate('/admin/trips/' + row.original.id)}
                          styles={(theme) => ({
                            root: {
                              backgroundColor: 'transparent',
                              justifyContent: 'flex-start',
                              cursor: 'pointer',
                              [theme.fn.smallerThan('sm')]: {
                                width: checkColumnTitle(cell, 'title') ? '300px' : '',
                              },
                              [theme.fn.largerThan('sm')]: {
                                width: checkColumnTitle(cell, 'title') ? '500px' : '',
                              },
                            },
                          })}
                        >
                          {row.original?.title}
                        </Badge>
                      ) : (
                        <Text
                          lineClamp={checkColumnTitle(cell, 'title') ? 1 : undefined}
                          styles={{
                            root: { width: checkColumnTitle(cell, 'title') ? '150px' : '' },
                          }}
                          {...(checkColumnTitle(cell, 'author')
                            ? {
                                style: { cursor: 'pointer' },
                                onClick: () => navigate('/admin/users/' + row.original?.user.id),
                              }
                            : {})}
                        >
                          {isFetching ? (
                            <Skeleton height={28} />
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
                <td style={{ width: '1px' }}>
                  <Group spacing={0} position="right">
                    <Menu size={'xs'} transition="pop" withArrow placement="end">
                      <Menu.Item
                        p={'xs'}
                        color={'green'}
                        onClick={() => navigate(`/admin/trips/${row.original.id}/edit`)}
                        icon={
                          <ActionIcon variant={'transparent'} size={'xs'} color={'green'}>
                            <Pencil size={MD_ICON_SIZE} />
                          </ActionIcon>
                        }
                      >
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        p={'xs'}
                        color={'red'}
                        onClick={() => {
                          setSelectedArticleId(row.original.id);
                          setOpenedDeleteConfirmationModal(true);
                        }}
                        icon={
                          <ActionIcon variant={'transparent'} size={'xs'} color={'red'}>
                            <Trash size={MD_ICON_SIZE} />
                          </ActionIcon>
                        }
                      >
                        Delete
                      </Menu.Item>
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

export default Table;

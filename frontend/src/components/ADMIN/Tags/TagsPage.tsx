import React, { useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Checkbox,
  createStyles,
  Group,
  ScrollArea,
  Table,
} from '@mantine/core';
import { CustomLoader } from '../../common/CustomLoader';
import { useTagsQuery } from '../../../api/tags/queries';
import { useSetTagsStatus } from '../../../api/tags/mutations';
import { Check, Trash } from '../../common/Icons';
import ConfirmationModal from '../../common/ConfirmationModal';
import { isEmptyArray } from '../../../utils/primitive-checks';
import { MD_ICON_SIZE } from '../../../utils/constants';

const useStyles = createStyles((theme) => ({
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'box-shadow 150ms ease',
    zIndex: 1,
    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },

  rowSelected: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
        : theme.colors[theme.primaryColor][0],
  },
}));

function TagsPage() {
  const { classes, cx } = useStyles();
  const [rows, setRows] = useState<any>([]);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [selection, setSelection] = useState<any>([]);
  const [status, setStatus] = useState<string>('');
  const [isOpenedConfirmationModal, setOpenedConfirmationModal] = useState<any>(false);

  const {
    data: dbTags,
    isSuccess: isSuccessTags,
    isLoading: isLoadingGetTags,
  } = useTagsQuery({
    showBlocked: true,
  });

  const { mutate: mutateChangeTagsStatus } = useSetTagsStatus(() => {
    setSelection([]);
  });

  const toggleRow = (id: string) => {
    setSelection((current: any) =>
      current.includes(id) ? current.filter((item: any) => item !== id) : [...current, id]
    );
  };

  const toggleAll = () => {
    setSelection((current: any) =>
      current.length === dbTags.length ? [] : dbTags.map((item: any) => item.id)
    );
  };

  useEffect(() => {
    setRows(
      dbTags?.map((element: any) => {
        const selected = selection.includes(element.id);
        return (
          <tr key={element.id} className={cx({ [classes.rowSelected]: selected })}>
            <td>
              <Checkbox
                checked={selection.includes(element.id)}
                onChange={() => toggleRow(element.id)}
                transitionDuration={0}
              />
            </td>
            <td>{element.name}</td>
            <td>{element._count.articles}</td>
            <td>
              <Badge color={element.status == 'BLOCKED' ? 'red' : 'blue'}>{element.status}</Badge>
            </td>
          </tr>
        );
      })
    );
  }, [dbTags, selection]);

  if (isLoadingGetTags || (!isSuccessTags && (!isEmptyArray(dbTags) || !isEmptyArray(rows))))
    return <CustomLoader />;

  return (
    <>
      <ConfirmationModal
        openedConfirmationModal={isOpenedConfirmationModal}
        setOpenedConfirmationModal={setOpenedConfirmationModal}
        handlerSubmit={() => mutateChangeTagsStatus({ tagsId: selection, status: status })}
      />
      <Group mb={'lg'} position={'apart'}>
        {selection != 0 ? (
          <Group>
            <Button
              compact
              color={'red'}
              onClick={() => {
                setStatus('BLOCKED');
                setOpenedConfirmationModal(true);
              }}
              leftIcon={<Trash size={MD_ICON_SIZE} />}
            >
              Block
            </Button>
            <Button
              compact
              color={'blue'}
              leftIcon={<Check size={MD_ICON_SIZE} />}
              onClick={() => {
                setStatus('ACTIVATED');
                setOpenedConfirmationModal(true);
              }}
            >
              Activate
            </Button>
          </Group>
        ) : (
          <Box></Box>
        )}
      </Group>
      <ScrollArea sx={{ height: '75vh' }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
        <Table
          sx={() => ({
            minWidth: 700,
            tr: { textAlign: 'center' },
          })}
          verticalSpacing="xs"
          striped
          highlightOnHover
        >
          <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
            <tr>
              <th style={{ width: 40 }}>
                <Checkbox
                  onChange={toggleAll}
                  checked={selection.length === dbTags?.length}
                  indeterminate={selection.length > 0 && selection.length !== dbTags?.length}
                  transitionDuration={0}
                />
              </th>
              <th style={{ textAlign: 'center' }}>Tag</th>
              <th style={{ textAlign: 'center' }}>Nr. of articles</th>
              <th style={{ textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </>
  );
}

export default TagsPage;

import React, {useEffect, useState} from 'react';
import {Box, Button, Checkbox, createStyles, Group, ScrollArea, Table} from "@mantine/core";
import {CustomLoader} from "../../common/CustomLoader";
import {TrashIcon} from "@modulz/radix-icons";
import {useDisclosure} from "@mantine/hooks";
import ConfirmationModal from "../ConfirmationModal";
import {useTagsQuery} from "../../../api/tags/queries";
import {useDeleteTag} from "../../../api/tags/mutations";

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
  const {classes, cx} = useStyles();
  const [rows, setRows] = useState<any>([])
  const [scrolled, setScrolled] = useState(false);
  const [openedRemoveCountriesModal, handlersRemoveCountriesModal] = useDisclosure(false);
  const [selection, setSelection] = useState<any>([]);

  const onSuccessDeleteTagaEvent = () => {
    handlersRemoveCountriesModal.close()
    setSelection([])
  }

  const {data: dbTags, isSuccess: isSuccessTags, isLoading: isLoadingGetTags} = useTagsQuery({});
  const {mutate: mutateRemoveTags} = useDeleteTag(onSuccessDeleteTagaEvent)

  const toggleRow = (id: string) =>
    setSelection((current: any) =>
      current.includes(id) ? current.filter((item: any) => item !== id) : [...current, id]
    );

  const toggleAll = () =>
    setSelection((current: any) => (current.length === dbTags.length
      ? []
      : dbTags.map((item: any) => item.name))
    );

  useEffect(() => {
    setRows(dbTags?.map((element: any) => {
      const selected = selection.includes(element.name);
      return <tr key={element.id} className={cx({[classes.rowSelected]: selected})}>
        <td>
          <Checkbox
            checked={selection.includes(element.name)}
            onChange={() => toggleRow(element.name)}
            transitionDuration={0}
          />
        </td>
        <td>{element.name}</td>
        <td>{element._count.articles}</td>
      </tr>
    }))
  }, [dbTags, selection])

  if (isLoadingGetTags || (!isSuccessTags && (dbTags?.length == 0 || rows?.length == 0)))
    return <CustomLoader/>

  return (
    <div>
      <ConfirmationModal
        handler={() => mutateRemoveTags({tags: selection})}
        isOpenModal={openedRemoveCountriesModal}
        modalHandler={handlersRemoveCountriesModal}
      />
      <Group mb={'lg'} position={'apart'}>
        {selection != 0
          ? <Button compact
                    color={'red'}
                    onClick={() => handlersRemoveCountriesModal.open()}
                    leftIcon={<TrashIcon/>}
          >
            Delete selected
          </Button>
          : <Box></Box>
        }
      </Group>
      <ScrollArea sx={{height: '75vh'}} onScrollPositionChange={({y}) => setScrolled(y !== 0)}>
        <Table
          sx={() => ({
            minWidth: 700,
            'tr': {textAlign: 'center',},
          })}
          verticalSpacing="xs" striped highlightOnHover>
          <thead className={cx(classes.header, {[classes.scrolled]: scrolled})}>
          <tr>
            <th style={{width: 40}}>
              <Checkbox
                onChange={toggleAll}
                checked={selection.length === dbTags?.length}
                indeterminate={selection.length > 0 && selection.length !== dbTags?.length}
                transitionDuration={0}
              />
            </th>
            <th style={{textAlign: 'center'}}>Tag</th>
            <th style={{textAlign: 'center'}}>Nr. of articles</th>
          </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </div>
  );
}

export default TagsPage;

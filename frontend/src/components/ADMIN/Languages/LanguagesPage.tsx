import React, {useEffect, useState} from 'react';
import {useMutateAddLanguages, useMutateRemoveLanguages} from "../../../api/languages/mutations";
import {useGetLanguages,} from "../../../api/languages/queries";
import {fetchLanguagesJsonData,} from "../../../api/languages/axios";
import {Box, Button, Checkbox, createStyles, Group, ScrollArea, Table} from "@mantine/core";
import {CustomLoader} from "../../common/CustomLoader";
import {Pencil1Icon, ResetIcon, TrashIcon} from "@modulz/radix-icons";
import {useDisclosure} from "@mantine/hooks";
import CreateModal from "../CreateModal";
import ConfirmationModal from "../ConfirmationModal";

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

function LanguagesPage() {
  const {classes, cx} = useStyles();
  const [rows, setRows] = useState<any>([])
  const [scrolled, setScrolled] = useState(false);
  const [openedCreateLangModal, handlersCreateLangModal] = useDisclosure(false);
  const [openedRemoveLangModal, handlersRemoveLangModal] = useDisclosure(false);
  const [openedResetLangModal, handlersResetLangModal] = useDisclosure(false);

  const [languagesJsonData, setLanguagesJsonData] = useState<any>([])
  const [selection, setSelection] = useState<any>([]);
  const [formattedLanguages, setFormattedLanguages] = useState<any>([])
  const {data: dataLanguages, isSuccess: isSuccessGetLanguages, isLoading: isLoadingGetLanguages} = useGetLanguages({});
  const {mutate: mutateAddLanguages} = useMutateAddLanguages(() => {
    handlersResetLangModal.close()
    setSelection([])
  })

  const {mutate: mutateRemoveLanguages} = useMutateRemoveLanguages(() => {
    handlersRemoveLangModal.close()
    setSelection([])
  })

  const toggleRow = (id: string) =>
    setSelection((current: any) =>
      current.includes(id) ? current.filter((item: any) => item !== id) : [...current, id]
    );

  const toggleAll = () =>
    setSelection((current: any) => (current.length === dataLanguages.length
      ? []
      : dataLanguages.map((item: any) => item.name))
    );

  useEffect(() => {
    fetchLanguagesJsonData(setLanguagesJsonData)
  }, [])


  useEffect(() => {
    const array: any = []
    Object.entries(languagesJsonData).forEach((entry: any) => {
      array.push(entry[1].name)
    });
    setFormattedLanguages([...array])
  }, [languagesJsonData])

  useEffect(() => {
    setRows(dataLanguages?.map((element: any) => {
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
        <td>{element.tripCount}</td>
        <td>{element.userCount}</td>
      </tr>
    }))
  }, [dataLanguages, selection])

  if (isLoadingGetLanguages)
    return <CustomLoader/>

  return (
    <div>
      <ConfirmationModal
        handler={() => mutateRemoveLanguages({languages: selection})}
        isOpenModal={openedRemoveLangModal}
        modalHandler={handlersRemoveLangModal}
      />
      <ConfirmationModal
        handler={() => mutateAddLanguages({languages: formattedLanguages})}
        isOpenModal={openedResetLangModal}
        modalHandler={handlersResetLangModal}
      />
      <CreateModal
        handler={mutateAddLanguages}
        isOpenModal={openedCreateLangModal} modalHandler={handlersCreateLangModal}/>
      <Group mb={'lg'} position={'apart'}>
        {selection != 0
          ? <Button compact
                    color={'red'}
                    onClick={() => handlersRemoveLangModal.open()}
                    leftIcon={<TrashIcon/>}
          >
            Delete selected
          </Button>
          : <Box></Box>
        }
        <Group>
          <Button onClick={() => handlersCreateLangModal.open()} leftIcon={<Pencil1Icon/>} compact>
            Add language
          </Button>
          <Button
            compact
            color={'pink'}
            leftIcon={<ResetIcon/>}
            onClick={() => handlersResetLangModal.open()}
          >
            Add default languages
          </Button>
        </Group>
      </Group>
      {(dataLanguages?.length != 0 && rows?.length == 0)
        ? <CustomLoader/>
        : <ScrollArea sx={{height: '75vh'}} onScrollPositionChange={({y}) => setScrolled(y !== 0)}>
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
                  checked={selection.length === dataLanguages?.length}
                  indeterminate={selection.length > 0 && selection.length !== dataLanguages?.length}
                  transitionDuration={0}
                />
              </th>
              <th style={{textAlign: 'center'}}>Language</th>
              <th style={{textAlign: 'center'}}>Nr. of trips</th>
              <th style={{textAlign: 'center'}}>Nr. of users</th>
            </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      }
    </div>
  );
}

export default LanguagesPage;

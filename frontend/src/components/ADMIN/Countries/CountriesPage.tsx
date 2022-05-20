import React, {useEffect, useState} from 'react';
import {fetchCountriesJsonData} from "../../../api/countries/axios";
import {useMutateAddCountries, useMutateRemoveCountries} from "../../../api/countries/mutations";
import {Box, Button, Checkbox, createStyles, Group, ScrollArea, Table} from "@mantine/core";
import {CustomLoader} from "../../common/CustomLoader";
import {Pencil1Icon, ResetIcon, TrashIcon} from "@modulz/radix-icons";
import {useDisclosure} from "@mantine/hooks";
import ConfirmationModal from "../ConfirmationModal";
import {useGetLocations} from "../../../api/countries/queries";
import CreateModal from "../CreateModal";

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

function CountriesPage() {
  const {classes, cx} = useStyles();
  const [rows, setRows] = useState<any>([])
  const [scrolled, setScrolled] = useState(false);
  const [openedCreateCountriesModal, handlersCreateCountriesModal] = useDisclosure(false);
  const [openedRemoveCountriesModal, handlersRemoveCountriesModal] = useDisclosure(false);
  const [openedResetCountriesModal, handlersResetCountriesModal] = useDisclosure(false);
  const [countriesJsonData, setCountriesJsonData] = useState<any>([])
  const [selection, setSelection] = useState<any>([]);
  const {mutate: mutateAddCountries} = useMutateAddCountries(() => {
    handlersResetCountriesModal.close()
    handlersCreateCountriesModal.close()
    setSelection([])
  })

  const {
    data: dbCountries,
    isSuccess: isSuccessCountries,
    isLoading: isLoadingGetCountries
  } = useGetLocations({isEnabled: true});

  const {mutate: mutateRemoveCountries} = useMutateRemoveCountries(() => {
    handlersRemoveCountriesModal.close()
    setSelection([])
  })

  useEffect(() => {
    if (openedResetCountriesModal)
      fetchCountriesJsonData(setCountriesJsonData)
  }, [openedResetCountriesModal])

  const toggleRow = (id: string) =>
    setSelection((current: any) =>
      current.includes(id) ? current.filter((item: any) => item !== id) : [...current, id]
    );

  const toggleAll = () =>
    setSelection((current: any) => (current.length === dbCountries.length
      ? []
      : dbCountries.map((item: any) => item.name))
    );

  useEffect(() => {
    setRows(dbCountries?.map((element: any) => {
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
        <td>{element.code}</td>
        <td>{element._count.users}</td>
        <td>{element._count.articles}</td>
        <td>{element._count.trips}</td>
        <td>{element._count.interestedInBy}</td>
        <td>{element._count.visitedBy}</td>
      </tr>
    }))
  }, [dbCountries, selection])

  if (isLoadingGetCountries)
    return <CustomLoader/>

  return (
    <div>
      <ConfirmationModal
        handler={() => mutateRemoveCountries({countries: selection})}
        isOpenModal={openedRemoveCountriesModal}
        modalHandler={handlersRemoveCountriesModal}
      />
      <ConfirmationModal
        handler={() => mutateAddCountries({countries: countriesJsonData})}
        isOpenModal={openedResetCountriesModal}
        modalHandler={handlersResetCountriesModal}
      />
      <CreateModal
        handler={mutateAddCountries}
        isOpenModal={openedCreateCountriesModal}
        modalHandler={handlersCreateCountriesModal}
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
        <Group>
          <Button onClick={() => handlersCreateCountriesModal.open()} leftIcon={<Pencil1Icon/>} compact>
            Add Country
          </Button>
          <Button
            compact
            color={'pink'}
            leftIcon={<ResetIcon/>}
            onClick={() => handlersResetCountriesModal.open()}
          >
            Add default countries
          </Button>
        </Group>
      </Group>
      {(dbCountries?.length != 0 && rows?.length == 0)
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
                  checked={selection.length === dbCountries?.length}
                  indeterminate={selection.length > 0 && selection.length !== dbCountries?.length}
                  transitionDuration={0}
                />
              </th>
              <th style={{textAlign: 'center'}}>Country</th>
              <th style={{textAlign: 'center'}}>Code</th>
              <th style={{textAlign: 'center'}}>Nr of users</th>
              <th style={{textAlign: 'center'}}>Nr. of articles</th>
              <th style={{textAlign: 'center'}}>Nr. of trips</th>
              <th style={{textAlign: 'center'}}>Interested by</th>
              <th style={{textAlign: 'center'}}>Visited by</th>
            </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      }
    </div>
  );
}

export default CountriesPage;

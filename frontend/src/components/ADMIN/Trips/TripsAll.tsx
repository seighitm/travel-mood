import React, {useEffect, useState} from 'react';
import {
  ActionIcon,
  Avatar,
  Button,
  Center,
  createStyles,
  Group,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import {ChevronDown, ChevronUp, Search, Selector} from '../../../assets/Icons';
import {Link, useNavigate} from "react-router-dom";
import {useTripsQuery} from "../../../api/trips/queries";
import {FilePlusIcon, ReloadIcon} from "@modulz/radix-icons";

const useStyles = createStyles((theme) => ({
  th: {
    padding: '0 !important',
  },

  control: {
    width: '100%',
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
}));

interface RowData {
  title: string;
  author: string;
  date: string;
  likes: string;
  comments: any;
  role: any;
}

interface TableSortProps {
  data: RowData[];
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;

  onSort(): void;
}

function Th({children, reversed, sorted, onSort}: ThProps) {
  const {classes} = useStyles();
  const Icon = sorted ? (reversed ? ChevronUp : ChevronDown) : Selector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text weight={500} size="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={14}/>
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

function filterData(data: RowData[], search: string) {
  const keys = Object.keys(data[0]);
  const query = search.toLowerCase().trim();
  return data.filter((item: any) => keys.some((key) => item[key].toLowerCase().includes(query)));
}

function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData; reversed: boolean; search: string }
) {
  if (!payload.sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[payload.sortBy].localeCompare(a[payload.sortBy]);
      }

      return a[payload.sortBy].localeCompare(b[payload.sortBy]);
    }),
    payload.search
  );
}

const data: any = [
  {
    "title": "Athena Weissnat",
    "author": "Elouise.Prohaska@yahoo.com",
    "date": "12.02.2019",
    "likes": "12"
  },
  {
    "title": "Deangelo Runolfsson",
    "author": "Kadin_Trantow87@yahoo.com",
    "date": "12.02.2019",
    "likes": "12"
  },
  {
    "title": "Danny Carter",
    "author": "Marina3@hotmail.com",
    "date": "12.02.2019",
    "likes": "12"
  },
  {
    "title": "Trace Tremblay PhD",
    "author": "Antonina.Pouros@yahoo.com",
    "date": "12.02.2019",
    "likes": "12"
  },
  {
    "title": "Derek Dibbert",
    "author": "Abagail29@hotmail.com",
    "date": "12.02.2019",
    "likes": "12"
  },
  {
    "title": "Viola Bernhard",
    "author": "Jamie23@hotmail.com",
    "date": "12.02.2019",
    "likes": "12"
  },
  {
    "title": "Austin Jacobi",
    "author": "Genesis42@yahoo.com",
    "date": "12.02.2019",
    "likes": "12"
  },
  {
    "title": "Hershel Mosciski",
    "author": "Idella.Stehr28@yahoo.com",
    "date": "12.02.2019",
    "likes": "12"
  },
  {
    "title": "Mylene Ebert",
    "author": "Hildegard17@hotmail.com",
    "date": "12.02.2019",
    "likes": "12"
  },
  {
    "title": "Lou Trantow",
    "author": "Hillard.Barrows1@hotmail.com",
    "date": "12.02.2019",
    "likes": "12"
  },
  {
    "title": "Dariana Weimann",
    "author": "Colleen80@gmail.com",
    "date": "12.02.2019",
    "likes": "12"
  },
  {
    "title": "Dr. Christy Herman",
    "author": "Lilyan98@gmail.com",
    "date": "12.02.2019",
    "likes": "12"
  },
  {
    "title": "Katelin Schuster",
    "author": "Erich_Brekke76@gmail.com",
    "date": "12.02.2019",
    "likes": "12"
  },
  {
    "title": "Melyna Macejkovic",
    "author": "Kylee4@yahoo.com",
    "date": "12.02.2019",
    "likes": "12"
  },
  {
    "title": "Pinkie Rice",
    "author": "Fiona.Kutch@hotmail.com",
    "date": "12.02.2019",
    "likes": "12"
  },
  {
    "title": "Brain Kreiger",
    "author": "Rico98@hotmail.com",
    "date": "12.02.2019",
    "likes": "12"
  }
]

export default function TripsAll() {
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState<any>([]);
  const [rows, setRows] = useState<any>([]);
  const [sortBy, setSortBy] = useState<any>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const {
    data: dbTrips,
    isFetching: isFetchingDbTrips,
    refetch: refetchDbTrips,
    isSuccess
  } = useTripsQuery({
    filterFields: {},
  });

  useEffect(() => {
    if (dbTrips)
      setSortedData(dbTrips.map((item: any) => ({
        author: item?.user?.name,
        title: item?.title,
        date: item?.updatedAt,
        likes: item?.tripFavoritedBy.length,
        comments: item?.tripComments?.length
      })))
    if (dbTrips)
      setRows(dbTrips.map((row: any) => (
        <tr key={row.id}>
          <td>
            <UnstyledButton component={Link} to={`/trips/${row.id}`}>
              {row.title}
            </UnstyledButton>
          </td>
          <td>
            <UnstyledButton onClick={() => navigate('/user/' + row.user.id)}>
              <Group>
                <Avatar size={'xs'} radius={'xl'} src={`${import.meta.env.VITE_API_URL}uploads/site/man.png`}/>
                <Text>
                  {row.user?.name}
                </Text>
              </Group>
            </UnstyledButton>
          </td>
          <td>{new Date(row.updatedAt).toISOString().split('T')[0]}</td>
          <td>{row.tripFavoritedBy.length}</td>
          <td>{row.tripComments?.length}</td>
        </tr>
      )))
  }, [isSuccess])

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(sortedData, {sortBy: field, reversed, search}));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(sortedData, {sortBy, reversed: reverseSortDirection, search: value}));
  };
  const navigate = useNavigate()

  return (
    <>
      <Group mb={'xl'} position={'center'}>
        <Button
          compact
          color={'pink'}
          leftIcon={<FilePlusIcon style={{width: '17px', height: '17px'}}/>}
          onClick={() => {
            navigate('/trips/add')
          }}
        >
          Add Trip
        </Button>
        <ActionIcon variant={'filled'} onClick={() => refetchDbTrips()}>
          <ReloadIcon/>
        </ActionIcon>
      </Group>
      <ScrollArea>
        <TextInput
          placeholder="Search by any field"
          mb="md"
          icon={<Search size={14}/>}
          value={search}
          onChange={handleSearchChange}
        />
        <Table
          horizontalSpacing="md"
          verticalSpacing="xs"
          sx={{tableLayout: 'fixed', minWidth: 700}}
        >
          <thead>
          <tr>
            <Th
              sorted={sortBy === 'title'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('title')}
            >
              Title
            </Th>
            <Th
              sorted={sortBy === 'author'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('author')}
            >
              Author
            </Th>
            <Th
              sorted={sortBy === 'date'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('date')}
            >
              Date
            </Th>
            <Th
              sorted={sortBy === 'likes'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('likes')}
            >
              Likes
            </Th>
            <Th
              sorted={sortBy === 'comments'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('comments')}
            >
              Comments
            </Th>
          </tr>
          </thead>
          <tbody>
          {rows && rows.length > 0 ? (
            rows
          ) : (
            <tr>
              {dbTrips && dbTrips.length != 0 &&
                <td colSpan={Object.keys(dbTrips[0]).length}>
                  <Text weight={500} align="center">
                    Nothing found
                  </Text>
                </td>
              }
            </tr>
          )}
          </tbody>
        </Table>
      </ScrollArea>
    </>
  );
}

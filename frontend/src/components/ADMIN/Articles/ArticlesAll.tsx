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
import {Selector} from '../../../assets/Icons';
import {useMutationDeleteArticle} from "../../../api/articles/mutations";
import {useGetAllArticles} from "../../../api/articles/queries";
import {Link, useNavigate} from "react-router-dom";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Cross2Icon,
  FilePlusIcon,
  MagnifyingGlassIcon,
  ReloadIcon
} from "@modulz/radix-icons";
import {useDisclosure} from "@mantine/hooks";
import ConfirmationModal from "../ConfirmationModal";
import {CustomLoader} from "../../common/CustomLoader";

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
  comments: any
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
  const Icon = sorted ? (reversed ? ChevronUpIcon : ChevronDownIcon) : Selector;
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

export default function ArticlesAll() {
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState<any>([]);
  const [rows, setRows] = useState<any>([]);
  const [sortBy, setSortBy] = useState<any>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [openedDeleteArticleModal, handlersDeleteArticleModal] = useDisclosure(false);
  const [selectedArticleId, setSelectedArticleId] = useState<any>(-1)

  const onSuccessEvent = () => {
    handlersDeleteArticleModal.close()
    setSelectedArticleId(-1)
  }

  const {mutate: mutateDeleteArticle} = useMutationDeleteArticle({
    onSuccessEvent: onSuccessEvent
  });

  const {
    data: articles,
    refetch: refetchArticles,
    isLoading: isLoadingArticles,
    isSuccess
  } = useGetAllArticles({});

  useEffect(() => {
    if (articles)
      setSortedData(articles?.articles.map((item: any) => ({
        author: item?.author?.name,
        userImage: item?.author?.picture,
        title: item?.title,
        date: item?.createdAt,
        likes: item?.favoritesCount,
        comments: item?.comments?.length
      })))
    setRows(articles?.articles.map((row: any) => (
      <tr key={row.title}>
        <td>
          <Text
            component={Link}
            to={`/articles/${row.id}`}
          >
            {row.title}
          </Text>
        </td>
        <td>
          <Group>
            <Avatar
              onClick={() => navigate(`/user/${row.author.id}`)}
              size={'xs'} radius={'xl'} src={`${import.meta.env.VITE_API_URL}uploads/site/man.png`}/>
            <Text
              component={Link}
              to={`/user/${row.author.id}`}
            >
              {row.author?.name}
            </Text>
          </Group>
        </td>
        <td>{new Date(row.createdAt).toISOString().split('T')[0]}</td>
        <td>{row.favoritesCount}</td>
        <td>{row.comments?.length}</td>
        <td>
          <Group position={'center'}>
            <ActionIcon
              size={'sm'}
              variant={'filled'}
              color={'red'}
              onClick={() => {
                setSelectedArticleId(row.id)
                handlersDeleteArticleModal.open()
              }}
            >
              <Cross2Icon/>
            </ActionIcon>
          </Group>
        </td>
      </tr>
    )))
  }, [isSuccess, articles])

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
      <ConfirmationModal
        handler={() => mutateDeleteArticle(selectedArticleId)}
        isOpenModal={openedDeleteArticleModal}
        modalHandler={handlersDeleteArticleModal}
      />
      <Group mb={'xl'} position={'center'}>
        <Button
          compact
          color={'pink'}
          leftIcon={<FilePlusIcon style={{width: '17px', height: '17px'}}/>}
          onClick={() => {
            navigate('/articles/add')
          }}
        >
          Add Article
        </Button>
        <ActionIcon variant={'filled'} onClick={() => refetchArticles()}>
          <ReloadIcon/>
        </ActionIcon>
      </Group>
      {isLoadingArticles
        ? <CustomLoader/>
        : <ScrollArea>
          <TextInput
            placeholder="Search by any field"
            mb="md"
            icon={<MagnifyingGlassIcon style={{width: '14px', height: '14px'}}/>}
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
              <th></th>
            </tr>
            </thead>
            <tbody>
            {rows && rows.length > 0 ? (
              rows
            ) : (
              <tr>
                {articles && articles?.articles?.length != 0 &&
                  <td colSpan={Object.keys(articles?.articles[0]).length}>
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
      }
    </>
  );
}

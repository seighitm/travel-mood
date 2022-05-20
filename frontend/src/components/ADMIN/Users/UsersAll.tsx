import React, {useEffect, useState} from 'react';
import {
  ActionIcon,
  Avatar,
  Button,
  Center,
  createStyles,
  Group,
  Modal,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import {ChevronDown, ChevronUp, Circle, Search, Selector} from '../../../assets/Icons';
import {useNavigate} from "react-router-dom";
import {
  useUserAccountActivate,
  useUserAccountBlock,
  useMutateSwitchUserRole
} from "../../../api/users/mutations";
import {useMutateAccessChat} from "../../../api/chat/mutations";
import chatStore from "../../../store/chat.store";
import useStore from "../../../store/user.store";
// import {useMutateReadNotifications} from "../../../api/notifications.api";
import {ArrowDownIcon, ArrowUpIcon, ChatBubbleIcon, LockClosedIcon, LockOpen1Icon} from "@modulz/radix-icons";
import {Calendar} from "@mantine/dates";
import {useFilterUser} from "../../../api/users/queries";

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
  name: any;
  rating: any;
  email: any;
  role: any;
}

interface TableSortProps {
  data: RowData[];
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  style?: any

  onSort(): void;
}

function Th({children, reversed, sorted, onSort, style}: ThProps) {
  const {classes} = useStyles();
  const Icon = sorted ? (reversed ? ChevronUp : ChevronDown) : Selector;
  return (
    <th className={classes.th} style={{...style}}>
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

export default function TripsAll() {
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState<any>([]);
  const [rows, setRows] = useState<any>([]);
  const [sortBy, setSortBy] = useState<any>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const {directSetSelectedChat} = chatStore((state: any) => state);
  const {user, onlineUsers} = useStore((state: any) => state);
  // const {mutate: mutateRead} = useMutateReadNotifications();
  const {
    mutate: mutateAccessChat,
    isSuccess: isSuccessAccessChat
  } = useMutateAccessChat();

  const {data, refetch, isSuccess} = useFilterUser({});
  const {mutate: mutateSwitchRole, isLoading: isLoadingSwitchRoleMutation} = useMutateSwitchUserRole();
  const {mutate: mutateBlockUser, isLoading: isLoadingBlockUserMutation} = useUserAccountBlock();
  const {
    mutate: mutateActivateUserAccount,
    isLoading: isLoadingActivateUserAccountMutation
  } = useUserAccountActivate();
  const isOnline = (userId: any) => onlineUsers[userId]
  // useEffect(() => {
  //   console.log()
  //   refetch()
  // }, [isLoadingSwitchRoleMutation])
  const navigate = useNavigate()
  const [modalType, setModalType] = useState<any>(null);
  const [value, setValue] = useState<any>(null);

  const [selectedUserId, setSelectedUserId] = useState<any>(null)

  useEffect(() => {
    if (isSuccessAccessChat)
      navigate('/chat')
  }, [isSuccessAccessChat])

  useEffect(() => {
    if (data)
      setSortedData(data.map((item: any) => ({
        name: item?.name,
        email: item?.email,
        rating: item?.rating.toString(),
        id: item?.id.toString(),
      })))
    if (data)
      setRows(data.map((row: any) => (
        <tr key={row.name}>
          <td>
            <ActionIcon size={'xs'} variant={'filled'} color={isOnline(row.id) ? 'green' : 'red'} radius={'xl'}>
              <Circle/>
            </ActionIcon>
          </td>
          <td>
            <UnstyledButton onClick={() => navigate('/user/' + row.id)}>
              <Group>
                <Avatar
                  size={'xs'}
                  radius={'xl'}
                  src={`${import.meta.env.VITE_API_URL}uploads/site/man.png`}
                />
                <Text
                  style={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    maxWidth: '130px',
                  }}
                >
                  {row.name}
                </Text>
              </Group>
            </UnstyledButton>
          </td>
          <td>{row?.email}</td>
          <td>{row?.rating}</td>
          <td>
            <Group position={'center'}>
              <ActionIcon variant={'filled'}
                          color={row.role.role == 'ADMIN' ? 'pink' : 'blue'}
                          onClick={() => mutateSwitchRole({userId: row.id})}
              >
                {row.role.role == 'ADMIN' ? <ArrowDownIcon/> : <ArrowUpIcon/>}
              </ActionIcon>
            </Group>
          </td>
          <td>
            <Group position={'center'}>
              <ActionIcon
                variant={'filled'}
                color={'teal'}
                onClick={() => {
                  mutateAccessChat(row.id)
                }}
              >
                <ChatBubbleIcon/>
              </ActionIcon>
            </Group>
          </td>
          <td>
            <ActionIcon
              variant={'filled'}
              color={row.activatedStatus == 'ACTIVATED' ? 'red' : ''}
              onClick={
                row.activatedStatus == 'ACTIVATED'
                  ? () => {
                    setSelectedUserId(row.id)
                    setModalType(row.activatedStatus == 'ACTIVATED' ? 'BLOCK' : 'ACTIVE')
                  }
                  : () => {
                    mutateActivateUserAccount({userId: row.id})
                  }
              }
            >
              {row.activatedStatus == 'ACTIVATED' ? <LockClosedIcon/> : <LockOpen1Icon/>}
            </ActionIcon>
          </td>
        </tr>
      )))
  }, [isSuccess, isLoadingSwitchRoleMutation, onlineUsers])


  // useEffect(() => {
  //   if (sortedData)
  //     setRows(sortedData.map((row: any) => (
  //       <tr key={row.name}>
  //         <td>
  //           <UnstyledButton onClick={() => navigate('/admin/user/' + row.id)}>
  //             <Group>
  //               <Avatar size={'xs'} radius={'xl'} src={'http://localhost:5000/uploads/site/man.png'}/>
  //               <Text>
  //                 {row.name}
  //               </Text>
  //             </Group>
  //           </UnstyledButton>
  //         </td>
  //         <td>{row?.email}</td>
  //         <td>{row?.rating}</td>
  //       </tr>
  //     )))
  // }, [sortedData])

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(sortedData, {sortBy: field, reversed, search}));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = event.currentTarget;
    setSearch(value);
    const misa = sortData(sortedData, {sortBy, reversed: reverseSortDirection, search: value})
    setSortedData(misa);
  };


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
      <ScrollArea pb={'lg'}>
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
            <th style={{width: '1%'}}></th>
            <Th
              sorted={sortBy === 'title'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('name')}
            >
              Name
            </Th>
            <Th
              sorted={sortBy === 'author'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('email')}
            >
              Email
            </Th>
            <Th
              style={{width: '15%'}}
              sorted={sortBy === 'date'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('rating')}
            >
              Rating
            </Th>
            <th style={{width: '2%'}}>
              <Group>
                <div>
                  Role
                </div>
              </Group>
            </th>
            <th style={{width: '2%'}}>
              <Group>
                <div>
                  Chat
                </div>
              </Group>
            </th>
            <th style={{width: '2%'}}>
              <Group>
                <div>
                  Status
                </div>
              </Group>
            </th>
          </tr>
          </thead>
          <tbody>
          {rows && rows.length > 0 ? (
            rows
          ) : (
            <tr>
              {data &&
                <td colSpan={Object.keys(data[0]).length}>
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

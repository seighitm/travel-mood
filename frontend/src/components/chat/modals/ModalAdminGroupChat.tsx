import React, {useEffect, useState} from 'react';
import chatStore from '../../../store/chat.store';
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Group,
  LoadingOverlay,
  Modal,
  MultiSelect,
  RingProgress,
  ScrollArea,
  TextInput,
} from '@mantine/core';
import {customNavigation, cutString, getFullUserName, userPicture} from '../../../utils/utils-func';
import {Check, CirclePlus, InfoCircle, Pencil, Trash, Users, X} from '../../common/Icons';
import {useGetUsersByNameOrEmail} from '../../../api/users/queries';
import {useDebouncedValue} from '@mantine/hooks';
import {
  useMutateAddUsersToGroupChat,
  useMutateRemoveUsersFromGroupChat,
  useMutateUpdateGroupChatName,
} from '../../../api/chat/mutations';
import {isEmptyArray, isNullOrUndefined} from '../../../utils/primitive-checks';
import useStore from '../../../store/user.store';
import {useNavigate} from "react-router-dom";

function ModalAdminGroupChat({isOpenedChatDetailsModal, setIsOpenedChatDetailsModal, chat}: any) {
  const {user, onlineUsers} = useStore((state: any) => state);
  const {selectedChat,} = chatStore((state: any) => state);
  const navigate = useNavigate()
  const [userName, setUserName] = useState<string>('');
  const [debouncedFirstName] = useDebouncedValue(userName, 200);
  const [selectedUsersToAdd, setSelectedUsersToAdd] = useState<any>([]);
  const [selectedUsersToRemove, setSelectedUsersToRemove] = useState<any>([]);
  const [isEditModeForChatName, setIsEditModeForChatName] = useState<boolean>(false);
  const [chatName, setChatName] = useState<string>('');

  const {data: dbUsers} = useGetUsersByNameOrEmail(debouncedFirstName);
  const {mutate: mutateAddUsersToGroupChat, isLoading: isLoadingAddUsersToGroup} =
    useMutateAddUsersToGroupChat();
  const {mutate: mutateRemoveUsersFromGroupChat, isLoading: isLoadingRemoveUsersFromGroup} =
    useMutateRemoveUsersFromGroupChat(() => setSelectedUsersToRemove([]));

  const {mutate: mutateUpdateGroupChatName, isLoading: isLoadingUpdateChatName} =
    useMutateUpdateGroupChatName(() => {
      setIsEditModeForChatName(false);
    });

  useEffect(() => {
    setChatName(chat?.chatName);
  }, [chat]);

  const handlerSelectorToRemoveUsers = (userId: any) => {
    if (selectedUsersToRemove.includes(userId)) {
      setSelectedUsersToRemove(selectedUsersToRemove.filter((us: any) => us != userId));
    } else {
      setSelectedUsersToRemove([...selectedUsersToRemove, userId]);
    }
  };

  const handlerSubmitAddUsers = () => {
    mutateAddUsersToGroupChat({usersId: selectedUsersToAdd, chatId: chat.id});
    setSelectedUsersToAdd([])
    setSelectedUsersToRemove([])
  };

  const handlerRemoveUsersFromGroup = () => {
    mutateRemoveUsersFromGroupChat({usersId: selectedUsersToRemove, chatId: chat.id});
    setSelectedUsersToAdd([])
    setSelectedUsersToRemove([])
  };

  return <>
    {selectedChat.id != -1 && (
      <Modal
        opened={isOpenedChatDetailsModal}
        centered
        withCloseButton={false}
        size={'sm'}
        onClose={() => {
          setIsOpenedChatDetailsModal(false)
          setSelectedUsersToAdd([])
          setSelectedUsersToRemove([])
        }}
        styles={{
          modal: {
            paddingTop: '10px!important',
            paddingBottom: '10px!important',
          },
        }}
      >
        <LoadingOverlay
          visible={
            isLoadingUpdateChatName || isLoadingAddUsersToGroup || isLoadingRemoveUsersFromGroup
          }
        />
        <Divider
          style={{width: '100%'}}
          my="xs"
          label={
            <>
              <InfoCircle size={15}/>
              <Box ml={5}>Chat name:</Box>
            </>
          }
        />
        <Group style={{width: '100%'}} mb={'xs'} position={'apart'} align={'center'}>
          <TextInput
            disabled={!isEditModeForChatName}
            style={{width: !isEditModeForChatName ? '85%' : '100%'}}
            onChange={(event) => setChatName(event.currentTarget.value)}
            value={chatName}
          />
          {!isEditModeForChatName && (
            <ActionIcon
              radius={'xl'}
              size={'lg'}
              color={'blue'}
              onClick={() => setIsEditModeForChatName(!isEditModeForChatName)}
            >
              <Pencil size={20}/>
            </ActionIcon>
          )}
        </Group>
        {isEditModeForChatName && (
          <Group position={'center'} mb={'sm'} style={{width: '100%'}}>
            <Button
              compact
              style={{width: '45%'}}
              disabled={
                isLoadingUpdateChatName ||
                isLoadingAddUsersToGroup ||
                isLoadingRemoveUsersFromGroup
              }
              onClick={() => {
                mutateUpdateGroupChatName({chatId: chat.id, chatName: chatName});
              }}
            >
              <Check size={20}/>
            </Button>
            <Button
              color={'red'}
              variant={'outline'}
              compact
              style={{width: '45%'}}
              onClick={() => setIsEditModeForChatName(false)}
            >
              <X size={20}/>
            </Button>
          </Group>
        )}
        <Divider
          style={{width: '100%'}}
          my="xs"
          mt={'xl'}
          label={
            <>
              <Users size={15}/>
              <Box ml={5}>Participants:</Box>
            </>
          }
        />
        <ScrollArea pr={'md'} offsetScrollbars style={{height: 400}}>
          <Group align={'center'} position={'center'} direction={'column'} spacing={0}>
            {chat?.users
              ?.filter((us: any) => us.id !== user.id)
              ?.map((item: any) => (
                <Badge
                  pl={0}
                  pr={5}
                  mb={'sm'}
                  size={'lg'}
                  color={selectedUsersToRemove.includes(item.id) ? 'pink' : 'gray'}
                  leftSection={
                    <RingProgress
                      style={{cursor: 'pointer'}}
                      onClick={() => customNavigation(user?.role, navigate, '/users/' + item.id)}
                      thickness={5}
                      size={32}
                      roundCaps
                      sections={[
                        {
                          value: 100,
                          color: (!isNullOrUndefined(onlineUsers) && onlineUsers[Number(item?.id)]) ? 'green' : 'red',
                        },
                      ]}
                      label={
                        <Center style={{position: 'relative'}}>
                          <Avatar size={20} radius={'xl'} src={userPicture(item)}/>
                        </Center>
                      }
                    />
                  }
                  rightSection={
                    <ActionIcon
                      onClick={() => handlerSelectorToRemoveUsers(item.id)}
                      disabled={
                        isLoadingUpdateChatName ||
                        isLoadingAddUsersToGroup ||
                        isLoadingRemoveUsersFromGroup
                      }
                      radius={'xl'}
                      size={'xs'}
                    >
                      <X/>
                    </ActionIcon>
                  }
                >
                  {cutString(getFullUserName(item), 20)}
                </Badge>
              ))}
          </Group>
          {selectedUsersToRemove.length != 0 && (
            <Group mt={'sm'} position={'center'}>
              <Button
                style={{width: '50%'}}
                variant={'outline'}
                color={'pink'}
                compact
                rightIcon={<Trash/>}
                disabled={
                  isLoadingUpdateChatName ||
                  isLoadingAddUsersToGroup ||
                  isLoadingRemoveUsersFromGroup
                }
                onClick={handlerRemoveUsersFromGroup}
              >
                Confirm
              </Button>
            </Group>
          )}
          <Divider
            style={{width: '100%'}}
            my="xs"
            mt={'xl'}
            label={
              <>
                <CirclePlus size={15}/>
                <Box ml={5}>Add new user:</Box>
              </>
            }
          />
          {!isEmptyArray(selectedUsersToAdd) && (
            <Group mb={'md'} position={'center'}>
              <Button onClick={handlerSubmitAddUsers} fullWidth compact rightIcon={<Check/>}>
                Add users
              </Button>
            </Group>
          )}
          <MultiSelect
            searchable
            limit={10}
            nothingFound="Nothing found"
            maxDropdownHeight={160}
            clearButtonLabel="Clear selection"
            data={
              dbUsers
                ? dbUsers
                  .filter(
                    (item: any) => !chat.users.find((chatUser: any) => chatUser.id == item.id)
                  )
                  .map((us: any) => ({
                    value: us.id,
                    label: cutString(getFullUserName(us), 30),
                  }))
                : []
            }
            clearable
            placeholder="Users"
            value={selectedUsersToAdd}
            onChange={setSelectedUsersToAdd}
          />
        </ScrollArea>
      </Modal>
    )}
  </>
}

export default ModalAdminGroupChat;

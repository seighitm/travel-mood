import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import chatStore from "../../../store/chat.store";
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  LoadingOverlay,
  Modal,
  Group,
  MultiSelect,
  ScrollArea,
  TextInput
} from "@mantine/core";
import {cutString, userPicture} from "../../common/Utils";
import {getFullUserName} from "../../../utils/utils-func";
import {Check, CirclePlus, InfoCircle, Pencil, Trash, User, X} from '../../../assets/Icons';
import {useGetUsersByNameOrEmail} from "../../../api/users/queries";
import {useDebouncedValue} from "@mantine/hooks";
import {
  useMutateAddUsersToGroupChat,
  useMutateRemoveUsersFromGroupChat,
  useMutateUpdateGroupChatName
} from "../../../api/chat/mutations";
import {isEmptyArray} from "../../../utils/primitive-checks";

function ModalAdminGroupChat({openedChatDetailsModal, handlersChatDetailsModal, chat}: any) {
  const navigate = useNavigate();
  const {selectedChat} = chatStore((state: any) => state);
  const [userName, setUserName] = useState<string>('');
  const [debouncedFirstName] = useDebouncedValue(userName, 200);
  const [selectedUsersToAdd, setSelectedUsersToAdd] = useState<any>([])
  const {data: dbUsers} = useGetUsersByNameOrEmail(debouncedFirstName);
  const {mutate: mutateAddUsersToGroupChat, isLoading: isLoadingAddUsersToGroup} = useMutateAddUsersToGroupChat()
  const {
    mutate: mutateRemoveUsersFromGroupChat,
    isLoading: isLoadingRemoveUsersFromGroup
  } = useMutateRemoveUsersFromGroupChat(() => setSelectedUsersToRemove([]))
  const [selectedUsersToRemove, setSelectedUsersToRemove] = useState<any>([])
  const [isEditModeForChatName, setIsEditModeForChatName] = useState<boolean>(false)
  const [chatName, setChatName] = useState<string>('')

  const {mutate: mutateUpdateGroupChatName, isLoading: isLoadingUpdateChatName} = useMutateUpdateGroupChatName(() => {
    setIsEditModeForChatName(false)
  })


  useEffect(() => {
    setChatName(chat?.chatName)
  }, [chat])

  const handlerSelectorToRemoveUsers = (userId: any) => {
    if (selectedUsersToRemove.includes(userId)) {
      setSelectedUsersToRemove(selectedUsersToRemove.filter((us: any) => us != userId))
    } else {
      setSelectedUsersToRemove([...selectedUsersToRemove, userId])
    }
  }

  const handlerSubmitAddUsers = () => {
    mutateAddUsersToGroupChat({usersId: selectedUsersToAdd, chatId: chat.id})
  }

  const handlerRemoveUsersFromGroup = () => {
    mutateRemoveUsersFromGroupChat({usersId: selectedUsersToRemove, chatId: chat.id})
  }

  // console.log(chat.users)
  // console.log(dbUsers)
  // console.log(dbUsers.filter((item: any) => !chat.users.find((chatUser: any) => chatUser.id == item.id)))


  return <>
    {selectedChat.id != -1 &&
      <Modal
        opened={openedChatDetailsModal}
        onClose={() => handlersChatDetailsModal.close()}
        centered
        withCloseButton={false}
        size={'sm'}
        styles={{
          modal: {
            paddingTop: '10px!important',
            paddingBottom: '10px!important'
          }
        }}
      >
        <LoadingOverlay visible={isLoadingUpdateChatName || isLoadingAddUsersToGroup || isLoadingRemoveUsersFromGroup}/>
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
            disabled={!isEditModeForChatName} style={{width: !isEditModeForChatName ? '85%' : '100%'}}
            onChange={(event) => setChatName(event.currentTarget.value)}
            value={chatName}/>
          {!isEditModeForChatName &&
            <ActionIcon radius={'xl'} variant={'default'} color={'blue'}
                        onClick={() => setIsEditModeForChatName(!isEditModeForChatName)}
            >
              <Pencil size={20}/>
            </ActionIcon>
          }
        </Group>
        {isEditModeForChatName &&
          <Group position={'center'} mb={'sm'} style={{width: '100%'}}>
            <Button compact style={{width: '45%'}}
                    disabled={isLoadingUpdateChatName || isLoadingAddUsersToGroup || isLoadingRemoveUsersFromGroup}
                    onClick={() => {
                      mutateUpdateGroupChatName({chatId: chat.id, chatName: chatName})
                    }}
            >
              <Check size={20}/>
            </Button>
            <Button color={'red'} variant={'outline'} compact style={{width: '45%'}}
                    onClick={() => setIsEditModeForChatName(false)}
            >
              <X size={20}/>
            </Button>
          </Group>
        }
        <Divider
          style={{width: '100%'}}
          my="xs"
          mt={'xl'}
          label={
            <>
              <User size={15}/>
              <Box ml={5}>Participants:</Box>
            </>
          }
        />
        <ScrollArea pr={'md'} offsetScrollbars style={{height: 400}}>
          <Group align={'center'} position={'center'} direction={'column'} spacing={0}>
            {chat?.users?.map((item: any) =>
              <Badge px={0}
                     mb={'xs'}
                     color={selectedUsersToRemove.includes(item.id) ? 'pink' : 'blue'}
                     leftSection={
                       <Avatar
                         size={'xs'}
                         radius={'xl'}
                         src={userPicture(item)}
                       />
                     }
                     rightSection={
                       <ActionIcon onClick={() => handlerSelectorToRemoveUsers(item.id)}
                                   disabled={isLoadingUpdateChatName || isLoadingAddUsersToGroup || isLoadingRemoveUsersFromGroup}
                                   radius={'xl'} size={'xs'}>
                         <X/>
                       </ActionIcon>
                     }
              >
                {cutString(getFullUserName(item), 20)}
              </Badge>
            )}
          </Group>
          {selectedUsersToRemove.length != 0 &&
            <Group mt={'sm'} position={'center'}>
              <Button style={{width: '50%'}}
                      variant={'outline'}
                      color={'pink'}
                      compact
                      rightIcon={<Trash/>}
                      disabled={isLoadingUpdateChatName || isLoadingAddUsersToGroup || isLoadingRemoveUsersFromGroup}
                      onClick={handlerRemoveUsersFromGroup}
              >
                Confirm
              </Button>
            </Group>
          }
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
          {!isEmptyArray(selectedUsersToAdd) &&
            <Group mb={'md'} position={'center'}>
              <Button onClick={handlerSubmitAddUsers}
                      fullWidth
                      compact rightIcon={<Check/>}>
                Add users
              </Button>
            </Group>
          }
          <MultiSelect
            searchable
            limit={10}
            maxDropdownHeight={160}
            clearButtonLabel="Clear selection"
            data={dbUsers ? dbUsers
              .filter((item: any) => !chat.users.find((chatUser: any) => chatUser.id == item.id))
              .map((us: any) => ({
                value: us.id,
                label: cutString(getFullUserName(us), 30)
              })) : []}
            clearable
            placeholder="Users"
            value={selectedUsersToAdd}
            onChange={setSelectedUsersToAdd}
          />
        </ScrollArea>
      </Modal>
    }
  </>
}

export default ModalAdminGroupChat;

import React, {useState} from 'react';
import {isEmptyArray, isNullOrUndefined} from '../../../utils/primitive-checks';
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Group,
  Modal,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import {ArrowNarrowRight, Check, CirclePlus, X} from '../../common/Icons';
import CustomPaper from '../../common/CustomPaper';
import {useGetUserById} from '../../../api/users/queries';
import {useMutateCreateGroupChat} from '../../../api/chat/mutations';
import {customNavigation, cutString, getFullUserName, userPicture,} from '../../../utils/utils-func';
import useStore from '../../../store/user.store';
import {useNavigate} from 'react-router-dom';

function ModalCreateGroupChat({isOpenedCreateChatGroupModal, setIsOpenedCreateChatGroupModal}: any) {

  const [chatName, setChatName] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<any>([]);
  const {user} = useStore((state: any) => state);
  const navigate = useNavigate();
  const {data} = useGetUserById({id: user?.id, isEnabled: true});
  const {mutate: mutateCreateGroupChat} = useMutateCreateGroupChat(() => {
    setIsOpenedCreateChatGroupModal(false);
    setChatName('')
    setSelectedUsers([])
  });

  const handlerAddUserToGroup = (user: any) => {
    setSelectedUsers((prev: any) => [
      ...prev,
      {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        picture: user.picture,
      },
    ]);
  };

  return (
    <Modal
      size={485}
      opened={isOpenedCreateChatGroupModal}
      onClose={() => {
        setIsOpenedCreateChatGroupModal(false);
        setSelectedUsers([]);
        setChatName('');
      }}
      centered
      withCloseButton={false}
      styles={{
        modal: {
          paddingTop: '10px!important',
          paddingBottom: '10px!important',
        },
      }}
    >
      {!isNullOrUndefined(data) && isEmptyArray(data) ? (
        <Stack align={'center'}>
          <Text weight={700} style={{fontSize: '20px'}} color="red">
            You have no friends!
          </Text>
          <Button rightIcon={<ArrowNarrowRight size={17}/>} variant={'subtle'}>
            Add new friends
          </Button>
        </Stack>
      ) : (
        <Stack>
          <TextInput
            required
            label="Chat name"
            placeholder="Enter chat name"
            value={chatName}
            onChange={(event) => setChatName(event.currentTarget.value)}
          />
          <Button
            compact
            leftIcon={<Check size={17}/>}
            disabled={chatName == '' || selectedUsers?.length < 1}
            onClick={() => {
              mutateCreateGroupChat({
                users: selectedUsers?.map((item: any) => item.id),
                chatName: chatName,
              });
            }}
          >
            Save
          </Button>
          <Group>
            {!isEmptyArray(selectedUsers) &&
              selectedUsers.map((user: any) => (
                <Badge
                  pl={0}
                  pr={'xs'}
                  px={'sm'}
                  variant={'outline'}
                  color={'gray'}
                  leftSection={
                    <Avatar
                      radius={'xl'}
                      size={'xs'}
                      src={userPicture(user)}
                    />
                  }
                  rightSection={
                    <ActionIcon
                      p={0}
                      m={0}
                      size={'xs'}
                      radius={'xl'}
                      onClick={() =>
                        setSelectedUsers(selectedUsers.filter((item: any) => item.id != user.id))
                      }
                    >
                      <X size={17}/>
                    </ActionIcon>
                  }
                >
                  {cutString(user.name, 10)}
                </Badge>
              ))}
          </Group>

          {!isNullOrUndefined(data) && isEmptyArray(data?.following) && (
            <Group position={'center'} align={'center'}>
              <Title align={'center'} order={3}>
                <Text align={'center'} color="blue" inherit component="span">
                  You are not following any users!
                </Text>
              </Title>
              <Button
                color={'gray'}
                variant={'outline'}
                rightIcon={<ArrowNarrowRight size={17}/>}
                onClick={() => navigate('/users')}
              >
                Go to users page
              </Button>
            </Group>
          )}

          <ScrollArea pr={'md'} offsetScrollbars style={{height: 400}}>
            {!isNullOrUndefined(data) &&
              !isEmptyArray(data?.following) &&
              data.following
                ?.filter((us: any) => us.id !== user.id)
                ?.map((item: any) => (
                  <CustomPaper key={item?.id}>
                    <Group
                      style={{width: '100%'}}
                      position={'apart'}
                      spacing={0}
                      px={'xs'}
                      my={'xs'}
                      noWrap
                      align={'center'}
                    >
                      <Group
                        style={{width: '20%', cursor: 'pointer'}}
                        onClick={() => customNavigation(user?.role, navigate, '/users/' + item.id)}
                      >
                        <Avatar size={'md'} radius={'xl'} src={userPicture(item)}/>
                      </Group>
                      <Stack spacing={'xs'} style={{width: '70%'}}>
                        <Text
                          style={{cursor: 'pointer'}}
                          onClick={() =>
                            customNavigation(user?.role, navigate, '/users/' + item.id)
                          }
                          lineClamp={1}
                        >
                          {getFullUserName(item)}
                        </Text>
                      </Stack>
                      <ActionIcon
                        radius={'xl'}
                        color={selectedUsers?.find((us: any) => us.id == item.id) ? 'red' : 'blue'}
                        variant={'filled'}
                        // disabled={selectedUsers?.find((user: any) => user.id == item.id)}
                        onClick={() => {
                          if (selectedUsers?.find((us: any) => us.id == item.id))
                            setSelectedUsers(selectedUsers.filter((us: any) => us.id != item.id));
                          else handlerAddUserToGroup(item);
                        }}
                      >
                        {selectedUsers?.find((us: any) => us.id == item.id) ? (
                          <X size={14}/>
                        ) : (
                          <CirclePlus size={15}/>
                        )}
                      </ActionIcon>
                    </Group>
                  </CustomPaper>
                ))}
          </ScrollArea>
        </Stack>
      )}
    </Modal>
  );
}

export default ModalCreateGroupChat;

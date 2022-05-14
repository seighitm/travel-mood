import React, {useState} from 'react';
import {isEmptyArray, isNullOrUndefined} from "../../../utils/primitive-checks";
import {ActionIcon, Avatar, Badge, Button, Group, Modal, ScrollArea, Stack, Text, TextInput} from "@mantine/core";
import {ArrowNarrowRight, Check, DeviceFloppy, Search, X} from "../../../assets/Icons";
import {cutString, userPicture} from "../../common/Utils";
import CustomPaper from "../../common/CustomPaper";
import {useFilterUser} from "../../../api/users/queries";
import {useMutateCreateGroupChat} from "../../../api/chat/mutations";
import {getFullUserName} from "../../../utils/utils-func";

function ModalCreateGroupChat({openedCreateChatGroupModal, handlersCreateChatGroupModal}: any) {
  const {data} = useFilterUser({});
  const {mutate: mutateCreateGroupChat} = useMutateCreateGroupChat()
  const [chatName, setChatName] = useState<string>('')
  const [selectedUsers, setSelectedUsers] = useState<any>([])

  const handlerAddUserToGroup = (user: any) => {
    setSelectedUsers((prev: any) =>
      [...prev, {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        picture: user.picture
      }])
  }

  return (
    <Modal
      opened={openedCreateChatGroupModal}
      onClose={() => handlersCreateChatGroupModal.close()}
      centered
      withCloseButton={false}
      styles={{
        modal: {
          paddingTop: '10px!important',
          paddingBottom: '10px!important'
        }
      }}
    >
      {!isNullOrUndefined(data) && isEmptyArray(data)
        ? <Stack align={'center'}>
          <Text weight={700} style={{fontSize: '20px'}} color="red">
            You have no friends!
          </Text>
          <Button
            rightIcon={<ArrowNarrowRight size={17}/>}
            variant={'subtle'}
          >
            Add new friends
          </Button>
        </Stack>
        : <Stack>
          <TextInput
            required
            label="Chat name"
            placeholder="Enter chat name"
            icon={<Search size={14}/>}
            value={chatName}
            onChange={(event) => setChatName(event.currentTarget.value)}
          />
          <Button
            compact
            leftIcon={<DeviceFloppy size={17}/>}
            disabled={chatName == '' || selectedUsers?.length < 2}
            onClick={() => {
              mutateCreateGroupChat({
                users: selectedUsers?.map((item: any) => item.id),
                chatName: chatName
              })
            }}
          >
            Save
          </Button>
          <Group>
            {!isEmptyArray(selectedUsers) && selectedUsers.map((user: any) =>
              <Badge
                px={'sm'}
                py={'sm'}
                variant={'outline'}
                color={'pink'}
                leftSection={<Avatar size={'xs'} src={userPicture(user.picture)}/>}
                rightSection={
                  <ActionIcon
                    p={0}
                    m={0}
                    size={'xs'}
                    radius={'xl'}
                    onClick={() => setSelectedUsers(selectedUsers.filter((item: any) => item.id != user.id))}
                  >
                    <X size={17}/>
                  </ActionIcon>
                }
              >
                {cutString(user.name, 10)}
              </Badge>
            )}
          </Group>
          <ScrollArea
            pr={'md'}
            offsetScrollbars
            style={{height: 400}}
          >
            {!isNullOrUndefined(data) && !isEmptyArray(data) &&
              data?.map((item: any) =>
                <CustomPaper key={item?.id}>
                  <Group
                    style={{width: '100%'}}
                    position={'apart'}
                    spacing={0}
                    px={'sm'}
                    my={'sm'}
                    noWrap
                    align={'center'}
                  >
                    <Group style={{width: '20%'}}>
                      <Avatar
                        size={'lg'}
                        radius={'xl'}
                        src={userPicture(item)}
                      />
                    </Group>
                    <Stack spacing={'xs'} style={{width: '70%'}}>
                      <Text>{getFullUserName(item)}</Text>
                      <Button
                        compact
                        leftIcon={<Check size={17}/>}
                        disabled={selectedUsers?.find((user: any) => user.id == item.id)}
                        onClick={() => handlerAddUserToGroup(item)}
                      >
                        Add
                      </Button>
                    </Stack>
                  </Group>
                </CustomPaper>
              )}
          </ScrollArea>
        </Stack>
      }
    </Modal>
  );
}

export default ModalCreateGroupChat;

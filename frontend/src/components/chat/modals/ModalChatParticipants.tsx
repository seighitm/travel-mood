import React from 'react';
import {ActionIcon, Avatar, Box, Group, Indicator, Modal, ScrollArea, Text} from '@mantine/core';
import CustomPaper from '../../common/CustomPaper';
import chatStore from '../../../store/chat.store';
import {useNavigate} from 'react-router-dom';
import {customNavigation, getFullUserName, userPicture} from '../../../utils/utils-func';
import useStore from '../../../store/user.store';
import {ChevronRight} from '../../common/Icons';

function ModalChatParticipants({isOpenedChatDetailsModal, setIsOpenedChatDetailsModal, chat}: any) {
  const navigate = useNavigate();
  const {onlineUsers} = useStore((state: any) => state);
  const {user} = useStore((state: any) => state);

  const {selectedChat} = chatStore((state: any) => state);
  return <>
    {selectedChat.id != -1 && (
      <Modal
        opened={isOpenedChatDetailsModal}
        onClose={() => setIsOpenedChatDetailsModal(false)}
        centered
        withCloseButton={false}
        styles={{
          modal: {
            paddingTop: '10px!important',
            paddingBottom: '10px!important',
          },
        }}
      >
        <ScrollArea pr={'md'} offsetScrollbars style={{height: 400}}>
          {chat?.users?.map((item: any) => (
            <CustomPaper key={item?.id}>
              <Group
                pl={'sm'}
                my={5}
                noWrap
                align={'center'}
                onClick={() => customNavigation(user?.role, navigate, '/users/' + item.id)}
                style={{cursor: 'pointer'}}
              >
                <Indicator
                  size={10}
                  position={'bottom-center'}
                  color={onlineUsers[item.id] ? 'green' : 'pink'}
                >
                  <Avatar size={'md'} radius={'xl'} src={userPicture(item)}/>
                </Indicator>
                <Box style={{width: '70%'}}>
                  <Text lineClamp={1}>{getFullUserName(item)}</Text>
                </Box>
                <ActionIcon>
                  <ChevronRight/>
                </ActionIcon>
              </Group>
            </CustomPaper>
          ))}
        </ScrollArea>
      </Modal>
    )}
  </>
}

export default ModalChatParticipants;

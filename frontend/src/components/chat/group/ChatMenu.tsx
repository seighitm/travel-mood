import React, { memo, useState } from 'react';
import { ActionIcon, Group, Menu, Modal } from '@mantine/core';
import { ExitIcon, GearIcon } from '@modulz/radix-icons';
import ChatModal from './ChatModal';
import GroupChatModal from './GroupChatModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import GroupListUsers from './GroupListUsers';
import chatStore from '../../../store/chat.store';

const ChatMenu = memo(() => {
  const [openedModal, setOpenedModal] = useState(false);
  const [typeModal, setTypeModal] = useState('');

  const [isOpenModalWithUsersList, setIsOpenModalWithUsersList] = useState(false);
  const { selectedChat } = chatStore((state: any) => state);

  return (
    <>
      <Modal
        centered
        opened={openedModal}
        onClose={() => setOpenedModal(false)}
        title="Introduce yourself!"
      >
        {typeModal == 'chat' ? (
          <ChatModal />
        ) : typeModal == 'groupChat' ? (
          <GroupChatModal />
        ) : (
          <UpdateGroupChatModal />
        )}
      </Modal>

      {selectedChat && (
        <Modal
          centered
          opened={isOpenModalWithUsersList}
          onClose={() => setIsOpenModalWithUsersList(false)}
          title="Introduce yourself!"
        >
          <GroupListUsers users={selectedChat.users} />
        </Modal>
      )}

      <Group position={'right'}>
        <Menu
          placement="end"
          gutter={6}
          control={
            <ActionIcon>
              <GearIcon />
            </ActionIcon>
          }
        >
          <Menu.Item
            color="red"
            icon={<ExitIcon />}
            onClick={() => {
              setTypeModal('chat');
              setOpenedModal(true);
            }}
          >
            Chat Modal
          </Menu.Item>
          <Menu.Item
            color="red"
            icon={<ExitIcon />}
            onClick={() => {
              setTypeModal('groupChat');
              setOpenedModal(true);
            }}
          >
            Group Chat Modal
          </Menu.Item>
          <Menu.Item
            color="red"
            icon={<ExitIcon />}
            onClick={() => {
              setTypeModal('updateGroupChat');
              setOpenedModal(true);
            }}
          >
            Update Group Chat Modal
          </Menu.Item>
        </Menu>
      </Group>
    </>
  );
});

export default ChatMenu;

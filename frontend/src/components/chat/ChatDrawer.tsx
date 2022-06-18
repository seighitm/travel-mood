import React, {Dispatch} from 'react';
import {Drawer} from '@mantine/core';
import MyChat from './MyChat';
import chatStore from '../../store/chat.store';
import {IChat} from '../../types/IChat';

interface ChatDrawerComponentProps {
  isLoadingChats: boolean;
  dataFetchMyChats: IChat[];
  setOpenedDrawer?: Dispatch<React.SetStateAction<any>>;
  setIsOpenedCreateChatGroupModal: any
}

function ChatDrawer({
                      dataFetchMyChats,
                      isLoadingChats,
                      setIsOpenedCreateChatGroupModal,
                    }: ChatDrawerComponentProps) {
  const {isOpenChatDrawer, setOpenedChatDrawer} = chatStore((state: any) => state);
  return (
    <Drawer
      padding="xl"
      size="xl"
      opened={isOpenChatDrawer}
      transitionTimingFunction="ease"
      onClose={() => setOpenedChatDrawer(false)}
    >
      <MyChat
        setIsOpenedCreateChatGroupModal={setIsOpenedCreateChatGroupModal}
        setOpenedDrawer={setOpenedChatDrawer}
        isLoadingChats={isLoadingChats}
        isDrawer={true}
        dataFetchMyChats={dataFetchMyChats}
      />
    </Drawer>
  );
}

export default ChatDrawer;

import React from 'react';
import {Drawer} from "@mantine/core";
import MyChat from "./MyChat";
import chatStore from "../../store/chat.store";

function ChatDrawer({dataFetchMyChats, isLoadingChats}: any) {
  const {isOpenChatDrawer, setOpenedChatDrawer} = chatStore((state: any) => state);
  return (
    <Drawer
      padding='xl'
      size='xl'
      opened={isOpenChatDrawer}
      transitionTimingFunction='ease'
      onClose={() => setOpenedChatDrawer(false)}
    >
      <MyChat
        setOpenedDrawer={setOpenedChatDrawer}
        isLoadingChats={isLoadingChats}
        isDrawer={true}
        dataFetchMyChats={dataFetchMyChats}
      />
    </Drawer>
  );
}

export default ChatDrawer;

import React from 'react';
import {Avatar, Box, Group, Modal, ScrollArea, Text} from "@mantine/core";
import CustomPaper from "../../common/CustomPaper";
import {userPicture} from "../../common/Utils";
import chatStore from "../../../store/chat.store";
import {useNavigate} from "react-router-dom";
import {getFullUserName} from "../../../utils/utils-func";

function ModalChatParticipants({openedChatDetailsModal, handlersChatDetailsModal, chat}: any) {
  const navigate = useNavigate();
  const {selectedChat} = chatStore((state: any) => state);

  return <>
    {selectedChat.id != -1 &&
      <Modal
        opened={openedChatDetailsModal}
        onClose={() => handlersChatDetailsModal.close()}
        centered
        withCloseButton={false}
        styles={{
          modal: {
            paddingTop: '10px!important',
            paddingBottom: '10px!important'
          }
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
                onClick={() => navigate('/user/' + item.id)}
                style={{cursor: 'pointer'}}
              >
                <Avatar
                  size={'lg'}
                  radius={'xl'}
                  src={userPicture(item)}
                />
                <Box style={{width: '70%'}}>
                  <Text>{getFullUserName(item)}</Text>
                </Box>
              </Group>
            </CustomPaper>
          ))}
        </ScrollArea>
      </Modal>
    }
  </>
}

export default ModalChatParticipants;

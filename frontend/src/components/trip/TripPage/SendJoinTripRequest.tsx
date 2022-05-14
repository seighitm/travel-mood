import React from 'react';
import {Avatar, Button, Group, Modal, ScrollArea, Stack, Text} from "@mantine/core";
import CustomPaper from "../../common/CustomPaper";
import {userPicture} from "../../common/Utils";
import {useMutateJoinToTrip} from "../../../api/trips/mutations";
import {useNavigate} from "react-router-dom";
import {isEmptyArray, isNullOrUndefined} from "../../../utils/primitive-checks";
import {ArrowNarrowRight, Check} from "../../../assets/Icons";
import {getFullUserName} from "../../../utils/utils-func";

function SendJoinTripRequest({openedInviteModal, handlersInviteModal, following, tripId}: any) {
  const {mutate: mutateJoinToTrip} = useMutateJoinToTrip();
  const navigate = useNavigate();

  return <Modal
    opened={openedInviteModal}
    onClose={() => handlersInviteModal.close()}
    centered
    withCloseButton={false}
    styles={{
      modal: {
        paddingTop: '10px!important',
        paddingBottom: '10px!important'
      }
    }}
  >
    {!isNullOrUndefined(following) && !isEmptyArray(following)
      ? <ScrollArea pr={'md'} offsetScrollbars style={{height: 400}}>
        {following?.map((item: any) => (
          <CustomPaper key={item?.id}>
            <Group style={{width: '100%!important'}} my={'sm'} noWrap align={'center'}>
              <Avatar
                onClick={() => navigate('/user/' + item.id)}
                size={'lg'}
                radius={'xl'}
                style={{cursor: 'pointer'}}
                src={userPicture(item)}
              />
              <Stack style={{width: '50%'}}>
                <Text>{getFullUserName(item)}</Text>
                <Button
                  leftIcon={<Check size={17}/>}
                  compact
                  onClick={() => {
                    mutateJoinToTrip({
                      tripId,
                      receiveUserId: item.id,
                    });
                  }}
                >
                  Send request
                </Button>
              </Stack>
            </Group>
          </CustomPaper>
        ))}
      </ScrollArea>
      : <Stack align={'center'}>
        <Text weight={700} style={{fontSize: '20px'}} color="red">
          You have no friends!
        </Text>
        <Button
          variant={'subtle'}
          onClick={() => navigate('/users')}
          rightIcon={<ArrowNarrowRight size={17}/>}
        >
          Add new friends
        </Button>
      </Stack>
    }
  </Modal>
}

export default SendJoinTripRequest;

import React, { useMemo, useState } from 'react';
import { Badge, Button, Group, LoadingOverlay, Modal, Textarea } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import dayjs from 'dayjs';
import { useUserAccountBlock } from '../../../api/admin/mutations';
import { isNullOrUndefined } from '../../../utils/primitive-checks';

const ModalBlockUser = ({ isOpenedBlockModal, setIsOpenedBlockModal, selectedUserId }: any) => {
  const [reason, setReason] = useState<string>('');
  const [dateValue, setDateValue] = useState<any>(null);
  const [calendarError, setCalendarError] = useState<string>('');

  const { mutate: mutateBlockUser, isLoading: isLoadingBlockUser } = useUserAccountBlock(() => {
    setIsOpenedBlockModal(false);
    setDateValue(null);
    setReason('');
  });

  const handlerBlockUser = () => {
    if (!isNullOrUndefined(dateValue)) {
      mutateBlockUser({ userId: selectedUserId, expiredBlockDate: dateValue, reason: reason });
    } else {
      setCalendarError("You didn't enter a date!");
    }
  };

  return (
    <Modal
      opened={isOpenedBlockModal}
      centered
      withCloseButton={false}
      styles={{ modal: { width: 'auto' } }}
      onClose={() => {
        setDateValue(null);
        setReason('');
        setIsOpenedBlockModal(false);
      }}
    >
      <LoadingOverlay visible={isLoadingBlockUser} />
      {useMemo(
        () => (
          <Calendar
            value={dateValue}
            onChange={setDateValue}
            minDate={dayjs(new Date()).toDate()}
          />
        ),
        [dateValue]
      )}
      {calendarError != '' && (
        <Group mt={'sm'} position={'center'}>
          <Badge fullWidth color={'red'}>
            {calendarError}
          </Badge>
        </Group>
      )}
      <Textarea
        my={'sm'}
        value={reason}
        onChange={(event) => setReason(event.currentTarget.value)}
        placeholder="Reason"
        autosize
        minRows={2}
        maxRows={4}
        mb={'md'}
      />

      <Group mt={'sm'} position={'center'}>
        <Button
          loading={isLoadingBlockUser}
          compact
          fullWidth
          disabled={isLoadingBlockUser}
          onClick={handlerBlockUser}
        >
          Block
        </Button>
      </Group>
    </Modal>
  );
};

export default ModalBlockUser;

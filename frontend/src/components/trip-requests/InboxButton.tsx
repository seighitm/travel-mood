import React from 'react';
import { ActionIcon, Button, createStyles, Group, Indicator, Menu, Text } from '@mantine/core';
import { ChevronDown, Cub } from '../common/Icons';

const useStyles = createStyles((theme) => ({
  button: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },

  menuControl: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    border: 0,
    borderLeft: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white}`,
  },
}));

const InboxButton = ({
  setJoinRequestStatus,
  joinRequestStatus,
  countPending,
  countReceived,
}: any) => {
  const { classes, theme } = useStyles();
  return (
    <Group noWrap spacing={0}>
      <Button
        className={classes.button}
        variant="gradient"
        leftIcon={<Cub size={15} />}
        onClick={() => setJoinRequestStatus('INBOX')}
        gradient={
          ['PENDING, APPROVED', 'INBOX'].includes(joinRequestStatus)
            ? { from: 'indigo', to: 'orange' }
            : undefined
        }
      >
        Inbox
      </Button>
      <Indicator
        size={16}
        disabled={Number(countPending) + Number(countReceived) == 0}
        label={countPending + countReceived}
        color={'pink'}
      >
        <Menu
          size={'sm'}
          styles={{
            itemLabel: {
              width: '100%',
            },
          }}
          control={
            <ActionIcon
              variant="filled"
              size={36}
              className={classes.menuControl}
              color={'#15aabf!important'}
            >
              <ChevronDown size={16} />
            </ActionIcon>
          }
          transition="pop"
          placement="end"
        >
          <Menu.Item
            color={joinRequestStatus[0] == 'PENDING' ? 'orange' : 'blue'}
            style={{ width: '100%' }}
            onClick={() => setJoinRequestStatus(['PENDING'])}
          >
            <Group style={{ width: '100%' }} position={'apart'}>
              <Text>Pending</Text>
              {countPending != 0 && (
                <ActionIcon
                  size={'sm'}
                  style={{
                    backgroundColor:
                      theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[1],
                  }}
                >
                  {countPending}
                </ActionIcon>
              )}
            </Group>
          </Menu.Item>
          <Menu.Item
            color={joinRequestStatus[0] == 'RECEIVED' ? 'orange' : 'blue'}
            style={{ width: '100%' }}
            onClick={() => setJoinRequestStatus(['RECEIVED'])}
          >
            <Group style={{ width: '100%' }} position={'apart'}>
              <Text>Received</Text>
              {countReceived != 0 && (
                <ActionIcon
                  size={'sm'}
                  style={{
                    backgroundColor:
                      theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[1],
                  }}
                >
                  {countReceived}
                </ActionIcon>
              )}
            </Group>
          </Menu.Item>
        </Menu>
      </Indicator>
    </Group>
  );
};

export default InboxButton;

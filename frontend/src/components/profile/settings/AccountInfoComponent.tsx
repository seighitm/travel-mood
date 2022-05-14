import React, {useState} from 'react';
import {ActionIcon, Group, Paper, PasswordInput, TextInput,} from '@mantine/core';
import useStore from '../../../store/user.store';
import {useForm} from '@mantine/form';
import {useMutateUserProfileUpdatePerosnalInfo} from '../../../api/users/mutations';
import {LockClosedIcon} from "@modulz/radix-icons";
import {At, Check, Pencil, X} from "../../../assets/Icons";

const AccountInfoComponent = React.memo(() => {
  const {user} = useStore((state: any) => state);
  const [editModeAccountData, setEditModeAccountData] = useState(true);
  const {mutate: mutateUpdateUserPersonalInfo} = useMutateUserProfileUpdatePerosnalInfo();

  const formAccount = useForm({
    initialValues: {
      email: user?.email,
      password: '',
      oldPassword: '',
    },
    validate: {
      password: (value, values) => {
        if (value?.trim().length <= 3) return 'Password should have at least 3 letters!'
        else if (value !== values?.oldPassword) return "Passwords don't match. Try again"
      },
      oldPassword: (value, values) => {
        if (value?.trim().length <= 3) return 'OldPassword should have at least 3 letters!'
        else if (value !== values?.password) return "Passwords don't match. Try again"
      },
      email: (value) => {
        if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)))
          return 'Invalid email!'
      },
    },
  });

  const handlerSubmitAccountInfo = (data: any) => {
    mutateUpdateUserPersonalInfo(data);
    setEditModeAccountData(true);
  };

  const handlerResetForm = () => {
    formAccount.reset();
    setEditModeAccountData(true);
  };

  return (
    <Paper
      radius={10}
      p={'lg'}
      mb={'xl'}
      shadow={'lg'}
      sx={(theme) => ({
        border: '2px solid ',
        borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[2],
        position: 'relative',
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
      })}
    >
      <form onSubmit={formAccount.onSubmit(handlerSubmitAccountInfo)}>
        <Group style={{position: 'relative'}} position="center" direction="column" grow>
          <Group position={'apart'} style={{width: '100%'}}>
            {editModeAccountData ? (
              <ActionIcon
                onClick={() => setEditModeAccountData(false)}
                radius="xl"
                variant="filled"
                color={'blue'}
              >
                <Pencil size={15}/>
              </ActionIcon>
            ) : (
              <>
                <ActionIcon onClick={handlerResetForm} radius="xl" variant="filled" color={'red'}>
                  <X size={15}/>
                </ActionIcon>
                <ActionIcon
                  type={'submit'}
                  onClick={() => setEditModeAccountData(false)}
                  radius="xl"
                  variant="filled"
                  color={'green'}
                >
                  <Check size={15}/>
                </ActionIcon>
              </>
            )}
          </Group>
        </Group>
        <TextInput
          mt="md"
          required
          label="Email"
          placeholder="Your email"
          icon={<At size={15}/>}
          {...formAccount.getInputProps('email')}
          disabled={editModeAccountData}
        />
        <PasswordInput
          mt="md"
          label="New Password"
          placeholder="New Password"
          icon={<LockClosedIcon style={{width: '15px', height: '15px'}}/>}
          {...formAccount.getInputProps('password')}
          disabled={editModeAccountData}
        />
        <PasswordInput
          mt="md"
          label="Old Password"
          placeholder="Old Password"
          icon={<LockClosedIcon style={{width: '15px', height: '15px'}}/>}
          {...formAccount.getInputProps('oldPassword')}
          disabled={editModeAccountData}
        />
      </form>
    </Paper>
  );
});

export default AccountInfoComponent;

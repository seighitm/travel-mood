import React, { useState } from 'react';
import { ActionIcon, Group, Paper, PasswordInput, TextInput } from '@mantine/core';
import useStore from '../../store/user.store';
import { useForm } from '@mantine/form';
import { useMutateUserProfileUpdatePersonalInfo } from '../../api/users/mutations';
import { At, Check, Lock, Pencil, X } from '../common/Icons';
import { isValidEmail } from '../../utils/utils-func';

const AccountInfoComponent = React.memo(() => {
  const { user } = useStore((state: any) => state);
  const [editModeAccountData, setEditModeAccountData] = useState(true);
  const { mutate: mutateUpdateUserPersonalInfo } = useMutateUserProfileUpdatePersonalInfo();

  const formAccount = useForm({
    initialValues: {
      email: user?.email,
      password: '',
      oldPassword: '',
    },
    validate: {
      password: (value, values) => {
        if (value?.trim().length <= 3) return 'Password should have at least 3 letters!';
        else if (value !== values?.oldPassword) return "Passwords don't match. Try again";
      },
      oldPassword: (value, values) => {
        if (value?.trim().length <= 3) return 'OldPassword should have at least 3 letters!';
        else if (value !== values?.password) return "Passwords don't match. Try again";
      },
      email: (value) => {
        if (!isValidEmail(value?.trim())) return 'Invalid email!';
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
        <Group style={{ position: 'relative' }} position="center" direction="column" grow>
          <Group position={'center'} style={{ width: '100%' }}>
            {editModeAccountData ? (
              <Group position={'center'} style={{ width: '100%' }}>
                <ActionIcon
                  onClick={() => setEditModeAccountData(false)}
                  radius="xl"
                  variant="transparent"
                  color={'blue'}
                >
                  <Pencil size={20} />
                </ActionIcon>
              </Group>
            ) : (
              <>
                <ActionIcon
                  type={'submit'}
                  onClick={() => setEditModeAccountData(false)}
                  radius="xl"
                  variant="outline"
                  color={'green'}
                >
                  <Check size={20} />
                </ActionIcon>
                <ActionIcon onClick={handlerResetForm} radius="xl" variant="outline" color={'red'}>
                  <X size={20} />
                </ActionIcon>
              </>
            )}
          </Group>
        </Group>
        <TextInput
          mt="xs"
          required
          label="Email"
          placeholder="Enter email"
          icon={<At size={15} />}
          {...formAccount.getInputProps('email')}
          disabled={editModeAccountData}
        />
        <PasswordInput
          mt="xs"
          label="New Password"
          placeholder="Enter new password"
          icon={<Lock size={15} />}
          {...formAccount.getInputProps('password')}
          disabled={editModeAccountData}
        />
        <PasswordInput
          mt="xs"
          label="Old Password"
          placeholder="Enter old password"
          icon={<Lock size={15} />}
          {...formAccount.getInputProps('oldPassword')}
          disabled={editModeAccountData}
        />
      </form>
    </Paper>
  );
});

export default AccountInfoComponent;

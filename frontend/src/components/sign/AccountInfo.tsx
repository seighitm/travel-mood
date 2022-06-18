import React, { Dispatch, SetStateAction, useRef } from 'react';
import {
  ActionIcon,
  Avatar,
  Button,
  Group,
  PasswordInput,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import { ArrowNarrowRight, At, Lock, User, X } from '../common/Icons';

interface AccountInfoComponentProps {
  form: any;
  setProfileImage: (e: File | null) => void;
  setStateRegistration: Dispatch<SetStateAction<string>>;
  profileImage: File;
}

const AccountInfo = ({
  form,
  setProfileImage,
  profileImage,
  setStateRegistration,
}: AccountInfoComponentProps) => {
  const openRef = useRef<any>();

  const handlerRemoveImage = () => {
    setProfileImage(null);
    openRef.current.value = '';
  };

  return (
    <form onSubmit={form.onSubmit(() => setStateRegistration('personal-info'))}>
      <input
        style={{ display: 'none' }}
        onChange={(e: any) => setProfileImage(e.target.files[0])}
        ref={openRef}
        type={'file'}
      />
      <Group position={'center'}>
        <Group direction={'column'} align={'flex-end'} style={{ position: 'relative' }}>
          {profileImage && (
            <ActionIcon
              style={{ position: 'absolute', zIndex: '1' }}
              onClick={handlerRemoveImage}
              color="red"
              size="xs"
              radius="xl"
              variant="filled"
            >
              <X size={10} />
            </ActionIcon>
          )}
          <UnstyledButton onClick={() => openRef.current.click()}>
            <Avatar
              src={profileImage && URL.createObjectURL(profileImage)}
              color={'blue'}
              size="lg"
              radius="xl"
            />
          </UnstyledButton>
        </Group>
      </Group>
      <TextInput
        mt="xs"
        data-autofocus
        required
        placeholder="Enter first name"
        label="First name"
        icon={<User size={20} />}
        {...form.getInputProps('firstName')}
      />
      <TextInput
        mt="xs"
        required
        placeholder="Enter last name"
        label="Last name"
        icon={<User size={20} />}
        {...form.getInputProps('lastName')}
      />
      <TextInput
        mt="xs"
        required
        placeholder="Enter email"
        label="Email"
        icon={<At size={20} />}
        {...form.getInputProps('email')}
      />
      <PasswordInput
        mt="xs"
        required
        placeholder="Enter password"
        label="Password"
        icon={<Lock size={20} />}
        {...form.getInputProps('password')}
      />
      <Group position="center" mt="xl">
        <Button rightIcon={<ArrowNarrowRight size={15} />} type="submit">
          Next step
        </Button>
      </Group>
    </form>
  );
};

export default AccountInfo;

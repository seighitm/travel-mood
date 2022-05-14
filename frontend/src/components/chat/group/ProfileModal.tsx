import React from 'react';
import { Avatar, Text } from '@mantine/core';

function ProfileModal({ user }: any) {
  return (
    <div>
      <Avatar />
      {user && (
        <>
          <Text>Name: {user.name}</Text>
          <Text>Email: {user.email}</Text>
        </>
      )}
    </div>
  );
}

export default ProfileModal;

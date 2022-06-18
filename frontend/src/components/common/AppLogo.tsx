import React from 'react';
import { Group, Image, Text } from '@mantine/core';

function AppLogo({ onClick }: { onClick?: () => void }) {
  return (
    <Group spacing={'xs'}>
      <Image
        m={0}
        p={0}
        height={30}
        src={`${import.meta.env.VITE_API_URL}uploads/site/map-logo.svg`}
      />
      <Text
        component="span"
        align="center"
        variant="gradient"
        gradient={{ from: 'indigo', to: 'orange', deg: 15 }}
        weight={700}
        onClick={onClick}
        style={{ fontFamily: 'Greycliff CF, sans-serif', fontSize: '22px', cursor: 'pointer' }}
      >
        travel mood
      </Text>
    </Group>
  );
}

export default AppLogo;

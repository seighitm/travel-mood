import React from 'react';
import {Box, Button, Group, Image, Paper, Text, Title} from '@mantine/core';
import {useNavigate} from "react-router-dom";
import image from '../../assets/icons/image.svg'

function Verify() {
  const navigate = useNavigate()
  return <Group
    position={'center'}
    sx={(theme) => ({
      height: '100vh',
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    })}
  >
    <Box style={{width: '360px'}}>
      <Paper withBorder p="lg" radius="md" shadow="md">
        <Group position={'center'}>
          <Image src={image} height={200} width={200}/>
        </Group>
        <Title mt={'sm'} align="center" order={2}>
          Check Your Email
        </Title>
        <Text mb={'lg'} align={'center'}>
          A sign in link has been sent to your email address
        </Text>
        <Group position="center" mt="xs">
          <Button variant="default" size="xs" onClick={() => navigate('/auth/login')}>
            Back to home page
          </Button>
        </Group>
      </Paper>
    </Box>
  </Group>
}

export default Verify;

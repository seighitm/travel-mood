import React from 'react';
import { Box, Button, Group, Image, Paper, Text, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

function SuccSendEmail() {
  const navigate = useNavigate();
  return (
    <Group position={'center'} style={{ height: '80vh' }}>
      <Box style={{ width: '360px' }}>
        <Paper
          withBorder
          p="lg"
          radius="md"
          shadow="lg"
          sx={(theme) => ({
            border: '2px solid ',
            borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[2],
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
          })}
        >
          <Group position={'center'}>
            <Image
              src={`${import.meta.env.VITE_API_URL}uploads/site/succ_send_email.svg`}
              height={210}
              width={250}
            />
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
  );
}

export default SuccSendEmail;

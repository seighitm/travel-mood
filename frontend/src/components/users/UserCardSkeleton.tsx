import React from 'react';
import { Grid, Group, Paper, Skeleton } from '@mantine/core';

const UserCardSkeleton = React.memo(() => {
  return (
    <Grid>
      {Array.from({ length: 6 }, (item, index) => (
        <Grid.Col mb={'md'} key={index} xs={12} sm={6} md={4} lg={3}>
          <Paper
            radius="md"
            withBorder
            shadow={'sm'}
            p="lg"
            sx={(theme) => ({
              border:
                '1px solid ' +
                (theme.colorScheme === 'light' ? theme.colors.gray[4] : theme.colors.gray[7]),
              position: 'relative',
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
            })}
          >
            <Group position={'center'}>
              <Skeleton height={100} circle />
              <Skeleton height={25} mt={8} radius="xl" />
            </Group>
            <Group grow>
              <Skeleton height={25} mt={8} radius="xl" />
              <Skeleton height={25} mt={8} radius="xl" />
            </Group>
          </Paper>
        </Grid.Col>
      ))}
    </Grid>
  );
});

export default UserCardSkeleton;

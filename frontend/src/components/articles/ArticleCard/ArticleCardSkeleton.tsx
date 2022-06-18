import React from 'react';
import {createStyles, Grid, Group, Paper, Skeleton} from '@mantine/core';

const useStyles = createStyles((theme) => ({
  card: {
    border: '2px solid ',
    borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[1],
    position: 'relative',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
  },
}));

const CustomCardSkeleton = React.memo(() => {
  const {classes} = useStyles();

  return (
    <Grid>
      {Array.from({length: 6}, (item, index) => (
        <Grid.Col mb={'md'} key={index} xs={12} sm={6} md={4} lg={4}>
          <Paper radius={'md'} shadow={'xs'} className={classes.card}>
            <Skeleton height={180} mb="xl"/>
            <Group mx={'xs'} mb={'xs'}>
              {Array.from({length: 3}, (item, index) => (
                <Skeleton key={index} height={12} mt={8} width="20%" radius="xl"/>
              ))}
            </Group>
            <Skeleton height={2} radius="sm"/>
            <Group px={'xs'}>
              <Skeleton my={'md'} width={'90%'} height={15} mt={8} radius="xl"/>
            </Group>
            <Group px={'xs'} direction={'row'}>
              <Skeleton height={50} circle/>
              <Group style={{width: '50%'}}>
                <Skeleton height={12} radius="xl"/>
                <Skeleton height={12} radius="xl"/>
              </Group>
            </Group>
            <Group px={'xs'} my={'sm'}>
              {Array.from({length: 7}, (item, index) => (
                <Skeleton key={index} height={20} width={20} radius="sm"/>
              ))}
            </Group>
            <Skeleton height={2} radius="sm"/>
            <Group px={'xs'} my={'sm'} style={{width: '100%'}} position="right">
              <Skeleton height={20} width={20} radius="sm"/>
              <Skeleton height={20} width={20} radius="sm"/>
            </Group>
          </Paper>
        </Grid.Col>
      ))}
    </Grid>
  );
});

export default CustomCardSkeleton;

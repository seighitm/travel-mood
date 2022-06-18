import React from 'react';
import {Box, createStyles, Grid, Group, Paper, Skeleton} from '@mantine/core';

const useStyles = createStyles((theme) => ({
  card: {
    border: '2px solid ',
    borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[1],
    position: 'relative',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
  },
}));

const CardTripSkeleton = () => {
  const {classes} = useStyles();

  return (
    <Box>
      {Array.from({ length: 6 }, (item: any, index: number) => (
        <Paper
          mb={'xl'}
          className={classes.card}
        >
          <Grid columns={24}>
            <Grid.Col lg={5} xl={5} md={7} sm={8} style={{ position: 'relative' }}>
              <Skeleton mx={8} height={'220px'} width={'97%'} mb="xs" />
              <Skeleton mx={8} height={'20px'} width={'97%'} mb="md" />
            </Grid.Col>
            <Grid.Col pt={'sm'} lg={19} xl={19} md={17} sm={16}>
              <Group mb={'sm'} direction={'row'} position={'apart'}>
                <Skeleton radius={'lg'} height={40} ml={'3%'} width={'50%'} />
                <Skeleton height={25} mr={'3%'} width={'9%'} radius={'xl'} />
              </Group>
              <Skeleton height={1} ml={'3%'} mb={'xs'} width={'95%'} />
              <Group mb={'xs'}>
                {Array.from({ length: 5 }, (_: any, index: number) => (
                  <Skeleton key={index} height={20} ml={'3%'} width={'10%'} radius={'lg'} />
                ))}
              </Group>
              <Skeleton height={1} ml={'3%'} mt={'sm'} mb={'xs'} width={'95%'} />
              <Skeleton height={15} ml={'3%'} width={'95%'} mb={'xs'} radius={'xs'} />
              <Skeleton height={15} ml={'3%'} width={'95%'} mb={'xs'} radius={'xs'} />
              <Skeleton height={15} ml={'3%'} width={'95%'} radius={'xs'} />
              <Skeleton height={1} ml={'3%'} mt={'sm'} mb={'xs'} width={'95%'} />
              <Group mb={'xs'}>
                {Array.from({ length: 4 }, (item: any, index: number) => (
                  <Skeleton key={index} height={20} ml={'3%'} width={'10%'} radius={'lg'} />
                ))}
              </Group>
            </Grid.Col>
          </Grid>
        </Paper>
      ))}
    </Box>
  );
};

export default CardTripSkeleton;

import React from 'react';
import {Box, Grid, Paper, Skeleton} from '@mantine/core';

const CardTripSkeleton = () => {
  return (
    <Box mt={60}>
      {Array.from({length: 12}, (_: any, index: number) => (
        <Paper
          key={index}
          mb={'xl'}
          sx={(theme) => ({
            position: 'relative',
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
          })}
        >
          <Grid columns={24}>
            <Grid.Col lg={5} xl={5} md={7} sm={8} style={{position: 'relative'}}>
              <Skeleton mr={8} ml={8} height={'300px'} width={'97%'} mb="md"/>
            </Grid.Col>
            <Grid.Col lg={19} xl={19} md={17} sm={16}>
              <Skeleton height={50} mt={'sm'} ml={'3%'} mb={25} width={'50%'}/>
              {Array.from({length: 5}, (_: any, index: number) =>
                <Skeleton key={index} height={20} ml={'3%'} mb={25} width={'95%'}/>
              )}
            </Grid.Col>
          </Grid>
        </Paper>
      ))}
    </Box>
  );
};

export default CardTripSkeleton;

/*
<Skeleton height={15} ml={'1%'} mt={15} mb={30} radius="xl" width={'98%'}/>
                        <Group>
                            <Skeleton height={15} ml={'1%'} mt={15} radius="xl" width={'20%'}/>
                            <Skeleton height={15} ml={'1%'} mt={15} radius="xl" width={'20%'}/>
                            <Skeleton height={15} ml={'1%'} mt={15} radius="xl" width={'20%'}/>
                            <Skeleton height={15} ml={'1%'} mt={15} radius="xl" width={'20%'}/>
                        </Group>
                        <Skeleton height={15} ml={'1%'} mt={15} radius="xl" width={'98%'}/>
                        <Skeleton height={15} ml={'1%'} mt={15} radius="xl" width={'98%'}/>
 */

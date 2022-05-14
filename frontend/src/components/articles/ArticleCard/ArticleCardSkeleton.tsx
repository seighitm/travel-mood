import React from 'react';
import {Grid, Group, Skeleton} from '@mantine/core';
import CustomPaper from "../../common/CustomPaper";

const CustomCardSkeleton = React.memo(() => {
  return (
    <Grid>
      {Array.from({length: 12}, (item, index) => (
        <Grid.Col mb={'md'} key={index} xs={12} sm={6} md={4} lg={4}>
          <CustomPaper>
            <Skeleton height={180} mb="xl"/>
            {Array.from({length: 3}, (item, index) => (
              <Skeleton key={index} height={10} mt={8} width="30%" radius="xl"/>
            ))}
            {Array.from({length: 3}, (item, index) => (
              <Skeleton key={index} height={8} mt={8} radius="xl"/>
            ))}
            <Group>
              {Array.from({length: 3}, (item, index) => (
                <Skeleton key={index} height={10} mt={8} width="30%" radius="xl"/>
              ))}
            </Group>
          </CustomPaper>
        </Grid.Col>
      ))}
    </Grid>
  );
});

export default CustomCardSkeleton;

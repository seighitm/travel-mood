import {Button, Group, Indicator} from '@mantine/core';
import {ReaderIcon} from '@modulz/radix-icons';
import React, {memo} from 'react';

const TabItemComponent = memo(({setJoinRequestStatus, joinRequestStatus, item, count}: any) => {
  return (
    <Indicator
      size={16}
      label={count}
      styles={{indicator: {padding: '0', zIndex: 1}}}
    >
      <Group style={{position: 'relative'}}>
        <Button
          leftIcon={<ReaderIcon/>}
          onClick={() => setJoinRequestStatus([item])}
          variant="gradient"
          gradient={
            joinRequestStatus == item
              ? {from: 'indigo', to: 'orange'}
              : undefined
          }
        >
          {item}
        </Button>
      </Group>
    </Indicator>
  );
});

export default TabItemComponent;

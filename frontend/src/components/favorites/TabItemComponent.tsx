import {Button, Group, Indicator} from '@mantine/core';
import {ReaderIcon} from '@modulz/radix-icons';
import React, {memo} from 'react';

const TabItemComponent = memo(({setTypeOfFavoriteItems, item, typeOfFavoriteItems}: any) => {
  return (
      <Group style={{position: 'relative'}}>
        <Button
          leftIcon={<ReaderIcon/>}
          onClick={() => setTypeOfFavoriteItems(item)}
          variant="gradient"
          gradient={
            typeOfFavoriteItems.toLowerCase() == item.toLowerCase()
              ? {from: 'indigo', to: 'orange'}
              : undefined
          }
        >
          {item}
        </Button>
      </Group>
  );
});

export default TabItemComponent;

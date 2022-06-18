import { Button, Group, Indicator } from '@mantine/core';
import React, { Dispatch, memo } from 'react';
import { News } from '../common/Icons';

interface TabItemComponentProps {
  joinRequestStatus: string;
  count: string | number;
  item: string;
  setJoinRequestStatus: Dispatch<React.SetStateAction<any>>;
}

const TabItemComponent = memo(
  ({ setJoinRequestStatus, joinRequestStatus, item, count }: TabItemComponentProps) => {
    return (
      <Indicator size={16} disabled={Number(count) == 0} label={count} color={'pink'}>
        <Group style={{ position: 'relative' }}>
          <Button
            leftIcon={<News size={15} />}
            onClick={() => setJoinRequestStatus([item])}
            variant="gradient"
            gradient={joinRequestStatus == item ? { from: 'indigo', to: 'orange' } : undefined}
          >
            {item}
          </Button>
        </Group>
      </Indicator>
    );
  }
);

export default TabItemComponent;

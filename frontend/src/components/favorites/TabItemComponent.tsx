import { Button, Group } from '@mantine/core';
import React, { Dispatch, memo } from 'react';
import { customNavigation } from '../../utils/utils-func';
import useStore from '../../store/user.store';
import { useNavigate } from 'react-router-dom';

interface TabItemComponentComponentProps {
  item: string;
  typeOfFavoriteItems: string | undefined;
  icon: any;
}

const TabItemComponent = memo(
  ({ item, icon, typeOfFavoriteItems }: TabItemComponentComponentProps) => {
    const { user } = useStore((state: any) => state);
    const navigate = useNavigate();

    return (
      <Group style={{ position: 'relative' }}>
        <Button
          leftIcon={icon}
          onClick={() => customNavigation(user?.role, navigate, `/favorites/${item}`)}
          variant="gradient"
          gradient={
            typeOfFavoriteItems?.toLowerCase() == item.toLowerCase()
              ? { from: 'indigo', to: 'orange' }
              : undefined
          }
        >
          {item}
        </Button>
      </Group>
    );
  }
);

export default TabItemComponent;

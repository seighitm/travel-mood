import React, { useState } from 'react';
import {
  ActionIcon,
  Avatar,
  Badge,
  Popover,
  TypographyStylesProvider,
  useMantineTheme,
} from '@mantine/core';
import { Stars } from './Icons';
import { isNullOrUndefined } from '../../utils/primitive-checks';
import { customNavigation, getFullUserName, userPicture } from '../../utils/utils-func';
import useStore from '../../store/user.store';
import { useNavigate } from 'react-router-dom';
import { LG_ICON_SIZE } from '../../utils/constants';

function PostFavoriteBy({ favoriteList }: any) {
  const [openedLikesCountPopup, setOpenedLikesCountPopup] = useState(false);
  const { user } = useStore((state: any) => state);
  const navigate = useNavigate();
  const theme = useMantineTheme();

  return (
    <Popover
      width={200}
      position="bottom"
      withArrow
      radius={'md'}
      opened={openedLikesCountPopup}
      onClose={() => setOpenedLikesCountPopup(false)}
      target={
        <ActionIcon
          size={'md'}
          color={'pink'}
          variant={'default'}
          radius={'xl'}
          onClick={() => setOpenedLikesCountPopup((o) => !o)}
          style={{
            height: '15px',
            padding: 0,
            width: '18px',
            textAlign: 'center',
          }}
        >
          <Stars color={theme.colors.pink[5]} size={LG_ICON_SIZE} />
        </ActionIcon>
      }
    >
      <TypographyStylesProvider>
        {favoriteList.map((item: any, index: number) => (
          <Badge
            py={'xs'}
            color={'gray'}
            mb={!isNullOrUndefined(favoriteList[index + 1]) ? 'xs' : 0}
            size={'md'}
            pl={0}
            leftSection={<Avatar ml={0} size={'xs'} src={userPicture(item)} />}
            fullWidth
            style={{ cursor: 'pointer', justifyContent: 'flex-start', fontSize: '10px' }}
            onClick={() => customNavigation(user?.role, navigate, '/users/' + item.id)}
          >
            {getFullUserName(item)}
          </Badge>
        ))}
      </TypographyStylesProvider>
    </Popover>
  );
}

export default PostFavoriteBy;

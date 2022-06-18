import React from 'react';
import {Button, TypographyStylesProvider, useMantineTheme} from '@mantine/core';
import {isEmptyArray, isNullOrUndefined} from '../../utils/primitive-checks';
import {Star} from './Icons';
import useStore from '../../store/user.store';
import {MD_ICON_SIZE} from '../../utils/constants';

function FavoriteStarButton({
                              isLoadingUF,
                              isLoadingFF,
                              handlerFavoriteArticle,
                              isFavorite,
                              favoriteByList,
                            }: any) {
  const {user} = useStore((state: any) => state);
  const theme = useMantineTheme();
  return (
    <TypographyStylesProvider>
      <Button
        mr={'md'}
        color="pink"
        compact
        pr={'xs'}
        radius={'xl'}
        styles={(theme) => ({
          root: {
            color: (isNullOrUndefined(user) && theme.colorScheme == 'dark') ? theme.white + '!important' : ''
          },
        })}
        disabled={isLoadingUF || isLoadingFF || isNullOrUndefined(user)}
        loading={isLoadingUF || isLoadingFF}
        onClick={handlerFavoriteArticle}
        variant={isFavorite ? 'filled' : 'outline'}
        leftIcon={
          !isNullOrUndefined(user) ? (
            <Star size={MD_ICON_SIZE} color={isFavorite ? 'white' : theme.colors.pink[6]}/>
          ) : undefined
        }
      >
        {!isEmptyArray(favoriteByList) ? favoriteByList.length : '0'}
      </Button>
    </TypographyStylesProvider>
  );
}

export default FavoriteStarButton;

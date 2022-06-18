import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share';
import React, { useRef } from 'react';
import { ActionIcon, Menu, useMantineTheme } from '@mantine/core';
import { Share } from '../Icons';

const SocialSharButtons = ({ url }: any) => {
  const theme = useMantineTheme();
  const faceboocRef: any = useRef<any>();
  const twitterRef: any = useRef<any>();

  return (
    <>
      <Menu
        size={'sm'}
        styles={(theme) => ({
          body: {
            borderColor: theme.colors.gray[6],
          },
        })}
        control={
          <ActionIcon size={25} radius={'xl'} variant={'light'}>
            <Share size={17} color={theme.colors.blue[6]} />
          </ActionIcon>
        }
      >
        <Menu.Item onClick={() => faceboocRef.current.click()} icon={<FacebookIcon size={14} />}>
          facebook
        </Menu.Item>
        <Menu.Item onClick={() => twitterRef.current.click()} icon={<TwitterIcon size={14} />}>
          twitter
        </Menu.Item>
      </Menu>
      <FacebookShareButton
        ref={faceboocRef}
        style={{ display: 'none' }}
        url={'https://travelmood.herokuapp.com' + url}
        title={'travel mood'}
      >
        F
      </FacebookShareButton>
      <TwitterShareButton
        ref={twitterRef}
        style={{ display: 'none' }}
        url={'https://travelmood.herokuapp.com' + url}
        title={'travel mood'}
      >
        T
      </TwitterShareButton>
    </>
  );
};

export default SocialSharButtons;

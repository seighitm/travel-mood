import {FacebookShareButton, TwitterShareButton} from 'react-share';
import React from 'react';

const SocialSharButtons = ({faceboocRef, twitterRef}: any) => {
  return (
    <>
      <FacebookShareButton
        ref={faceboocRef}
        style={{display: 'none'}}
        url={'http://www.camperstribe.com'}
        quote={'CampersTribe - World is yours to explore'}
        hashtag="#camperstribe"
      >F</FacebookShareButton>
      <TwitterShareButton
        ref={twitterRef}
        style={{display: 'none'}}
        url={'http://www.camperstribe.com'}
        title={'CampersTribe - World is yours to explore'}
      >T</TwitterShareButton>
    </>
  );
};

export default SocialSharButtons;

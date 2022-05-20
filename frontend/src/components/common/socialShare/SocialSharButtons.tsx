import {FacebookShareButton, TwitterShareButton} from 'react-share';
import React from 'react';
import { Helmet } from 'react-helmet';

const SocialSharButtons = ({faceboocRef, twitterRef}: any) => {
  return (
    <>
      {/*<Helmet>*/}
      {/*  <meta property="og:image"  data-react-helmet="true" />*/}
      {/*  <meta property="og:image:secure_url"  data-react-helmet="true" />*/}
      {/*  <meta property="og:url" content={window.location.href} />*/}
      {/*  <meta data-react-helmet="true" property="og:url" content="" />*/}
      {/*  <meta property="og:description"  data-react-helmet="true" />*/}
      {/*  <meta property="og:image:height" content="1846"  />*/}
      {/*  <meta property="og:image:width" content="1200" data-react-helmet="true" />*/}
      {/*  <meta content="image/*" property="og:image:type" />*/}

      {/*</Helmet>*/}
      <FacebookShareButton
        ref={faceboocRef}
        style={{display: 'none'}}
        url={'https://travel--app--project.herokuapp.com/'}
        quote={'misa'}
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

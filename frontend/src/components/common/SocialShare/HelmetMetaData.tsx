import { Helmet } from 'react-helmet';
export default function HelmetMetaData(props: any) {
  let currentUrl = 'http://localhost:3000';
  let quote = props.quote !== undefined ? props.quote : '';
  let title = props.title !== undefined ? props.title : 'react share ';
  let image = props.image !== undefined ? props.image : 'https://source.unsplash.com/random';
  let description =
    props.description !== undefined
      ? props.description
      : "orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recentlwith desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
  let hashtag = props.hashtag !== undefined ? props.hashtag : '#reactJs';
  return (
    <Helmet>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="csrf_token" content="" />
      <meta property="type" content="website" />
      <meta property="url" content={currentUrl} />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="_token" content="" />
      <meta name="robots" content="noodp" />
      <meta property="title" content={title} />
      <meta property="quote" content={quote} />
      <meta name="description" content={description} />
      <meta property="image" content={image} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:quote" content={quote} />
      <meta property="og:hashtag" content={hashtag} />
      <meta property="og:image" content={image} />
      <meta content="image/*" property="og:image:type" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="CampersTribe" />
      <meta property="og:description" content={description} />{' '}
    </Helmet>
  );
}

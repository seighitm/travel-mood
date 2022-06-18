import React from 'react';

const TripPage = React.lazy(() => import('../../trip/TripPage/TripPage'));
const UserAllImages = React.lazy(() => import('../../profile/user-images/UserAllImages'));
const Complaints = React.lazy(() => import('../../admin/Complaints/Complaints'));
const GeneralMap = React.lazy(() => import('../../maps/GeneralMap'));
const Verify = React.lazy(() => import('../../sign/SuccSendEmail'));
const ResetPassword = React.lazy(() => import('../../sign/ResetPassword'));
const ForgotPassword = React.lazy(() => import('../../sign/ForgotPassword'));
const LanguagesPage = React.lazy(() => import('../../admin/Languages/LanguagesPage'));
const CountriesPage = React.lazy(() => import('../../admin/Countries/CountriesPage'));
const TagsPage = React.lazy(() => import('../../admin/Tags/TagsPage'));
const AllArticlesLayout = React.lazy(() => import('../../articles/AllArticle/AllArticlePage'));
const ProfileInfo = React.lazy(() => import('../../settings/UpdateProfile'));
const SignIn = React.lazy(() => import('../../sign/SignIn'));
const SignUpForm = React.lazy(() => import('../../sign/SignUp'));
const AddArticle = React.lazy(() => import('../../articles/ArticleCreate/ArticleCreate'));
const ArticlePage = React.lazy(() => import('../../articles/ArticlePage/ArticlePage'));
const Chat = React.lazy(() => import('../../chat/ChatPage'));
const UpdateArticleComponent = React.lazy(
  () => import('../../articles/ArticleUpdate/ArticleUpdate')
);
const UsersList = React.lazy(() => import('../../users/UsersList'));
const CreateTrip = React.lazy(() => import('../../trip/CreateTrip/CreateTrip'));
const AllTrips = React.lazy(() => import('../../trip/AllTripsPage/AllTrips'));
const UpdateTripPage = React.lazy(() => import('../../trip/UpdateTripPage/UpdateTripPage'));
const AllFavorites = React.lazy(() => import('../../favorites/AllFavorites'));
const ProfileViews = React.lazy(() => import('../../profile-views/ProfileViews'));
const AllInvitations = React.lazy(() => import('../../trip-requests/AllTripRequests'));
const UserProfile = React.lazy(() => import('../../profile/UserProfile'));
const HeroContentLeft = React.lazy(() => import('../HeroSection'));
const ArticlesAdmin = React.lazy(() => import('../../admin/Articles/WrapperTableArticles'));
const UsersAdmin = React.lazy(() => import('../../admin/Users/WrapperTableUsers'));
const TripsAdmin = React.lazy(() => import('../../admin/Trips/WrapperTableTrips'));

export const authRoutes = [
  {
    path: '/auth/signup',
    component: <SignUpForm />,
  },
  {
    path: '/auth/login',
    component: <SignIn />,
  },
  {
    path: '/auth/forgot-password',
    component: <ForgotPassword />,
  },
  {
    path: '/auth/reset-password/:resetToken',
    component: <ResetPassword />,
  },
  {
    path: '/auth/verify',
    component: <Verify />,
  },
];

export const hostRoutes = [
  {
    path: '/trips/:id',
    component: <TripPage />,
  },
  {
    path: '/articles/:id',
    component: <ArticlePage />,
  },
  {
    path: '/articles',
    component: <AllArticlesLayout />,
  },
  {
    path: '/articles/:page',
    component: <AllArticlesLayout />,
  },
  {
    path: '/home',
    component: <AllArticlesLayout />,
  },
  {
    path: '/users',
    component: <UsersList />,
  },
  {
    path: '/trips/:page',
    component: <AllTrips />,
  },
  {
    path: '/users/:id',
    component: <UserProfile />,
  },
  {
    path: '/map',
    component: <GeneralMap />,
  },
  {
    path: '/trips',
    component: <AllTrips />,
  },
  {
    path: '/',
    component: <HeroContentLeft />,
  },
];

export const adminRoutes = [
  {
    path: '/trips/:id',
    component: <TripPage />,
  },
  {
    path: '/complaints',
    component: <Complaints />,
  },
  {
    path: '/articles',
    component: <ArticlesAdmin />,
  },
  {
    path: '/users',
    component: <UsersAdmin />,
  },
  {
    path: '/languages',
    component: <LanguagesPage />,
  },
  {
    path: '/countries',
    component: <CountriesPage />,
  },
  {
    path: '/tags',
    component: <TagsPage />,
  },
  // {
  //   path: '',
  //   component: <UsersAdmin/>,
  // },
  {
    path: '/trips',
    component: <TripsAdmin />,
  },
];

export const userRoutes = [
  {
    path: '/articles/:id/edit',
    component: <UpdateArticleComponent />,
  },
  {
    path: '/chat/:id',
    component: <Chat />,
  },
  {
    path: '/trips/:id/edit',
    component: <UpdateTripPage />,
  },
  {
    path: '/users/:id/edit',
    component: <ProfileInfo />,
  },
  {
    path: '/view',
    component: <ProfileViews />,
  },
  {
    path: '/favorites',
    component: <AllFavorites />,
  },
  {
    path: '/favorites/:type',
    component: <AllFavorites />,
  },
  {
    path: '/trip-requests',
    component: <AllInvitations />,
  },
  {
    path: '/articles/add',
    component: <AddArticle />,
  },
  {
    path: '/trips/add',
    component: <CreateTrip />,
  },
  {
    path: '/users/:id/edit',
    component: <ProfileInfo />,
  },
  {
    path: '/chat',
    component: <Chat />,
  },
  {
    path: '/users/:id/images',
    component: <UserAllImages />,
  },
];

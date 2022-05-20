import React from "react";
import TripPage from "../../trip/TripPage/TripPage";
const UserAllImages = React.lazy(() => import('../../profile/user-images/UserAllImages'));
const Complaints = React.lazy(() => import("../../ADMIN/Compliants/Complaints"));
const GeneralMap = React.lazy(() => import("../../maps/GeneralMap"));
const Verify = React.lazy(() => import("../../sign/Verify"));
const ResetPassword = React.lazy(() => import("../../sign/ResetPassword"));
const ForgotPassword = React.lazy(() => import("../../sign/ForgotPassword"));
const LanguagesPage = React.lazy(() => import("../../ADMIN/Languages/LanguagesPage"));
const CountriesPage = React.lazy(() => import("../../ADMIN/Countries/CountriesPage"));
const TagsPage = React.lazy(() => import("../../ADMIN/Tags/TagsPage"));
const AllArticlesLayout = React.lazy(() => import('../../articles/AllArticle/AllArticlePage'));
const ProfileInfo = React.lazy(() => import('../../profile/settings/UpdateProfile'));
const SignIn = React.lazy(() => import('../../sign/SignIn'));
const SignUpForm = React.lazy(() => import('../../sign/SignUp'));
const AddArticle = React.lazy(() => import('../../articles/ArticleCreate/ArticleCreate'));
const ArticlePage = React.lazy(() => import('../../articles/ArticlePage/ArticlePage'));
const Chat = React.lazy(() => import('../../chat/ChatPage'));
const UpdateArticleComponent = React.lazy(() => import('../../articles/ArticleUpdate/ArticleUpdate'));
const UsersList = React.lazy(() => import('../../users/UsersList'));
const CreateTrip = React.lazy(() => import('../../trip/CreateTrip/CreateTrip'));
const AllTrips = React.lazy(() => import('../../trip/AllTripsPage/AllTrips'));
const UpdateTripPage = React.lazy(() => import('../../trip/UpdateTripPage/UpdateTripPage'));
// const TripPage = React.lazy(() => import('../../trip/TripPage/TripPage'));
const AllFavorites = React.lazy(() => import('../../favorites/AllFavorites'));
const ProfileViews = React.lazy(() => import('../../profile-views/ProfileViews'));
const AllInvitations = React.lazy(() => import('../../trip-requests/AllTripRequests'));
const UserProfile = React.lazy(() => import('../../profile/UserProfile'));
const HeroContentLeft = React.lazy(() => import('../../landing/HeroComponent'));
const ArticlesAdmin = React.lazy(() => import("../../ADMIN/Articles/components/TableArticles"));
const UsersAdmin = React.lazy(() => import("../../ADMIN/Users/components/TableUsers"));
const TripsAdmin = React.lazy(() => import("../../ADMIN/Trips/components/TableTrips"));

export const hostRoutes = [
  {
    path: '/article/:id',
    component: <ArticlePage/>,
  },
  {
    path: '/auth/signup',
    component: <SignUpForm/>,
  },
  {
    path: '/auth/login',
    component: <SignIn/>,
  },
  {
    path: '/auth/forgot-password',
    component: <ForgotPassword/>,
  },
  {
    path: '/auth/reset-password/:resetToken',
    component: <ResetPassword/>,
  },
  {
    path: '/auth/verify',
    component: <Verify/>,
  },
  {
    path: '/articles',
    component: <AllArticlesLayout/>,
  },
  {
    path: '/articles/:page',
    component: <AllArticlesLayout/>,
  },
  {
    path: '/home',
    component: <AllArticlesLayout/>,
  },
  {
    path: '/users',
    component: <UsersList/>,
  },
  {
    path: '/trips',
    component: <AllTrips/>,
  },
  {
    path: '/trips/:page',
    component: <AllTrips/>,
  },
  {
    path: '/trip/:id',
    component: <TripPage/>,
  },
  {
    path: '/user/:id',
    component: <UserProfile/>,
  },
  {
    path: '/',
    component: <HeroContentLeft/>,
  },
  {
    path: '/map',
    component: <GeneralMap/>,
  },
];

export const adminRoutes = [
  {
    path: '/complaints',
    component: <Complaints/>,
  },
  {
    path: '',
    component: <UsersAdmin/>,
  },
  {
    path: '/articles',
    component: <ArticlesAdmin/>,
  },
  {
    path: '/trips',
    component: <TripsAdmin/>,
  },
  {
    path: '/users',
    component: <UsersAdmin/>,
  },
  {
    path: '/languages',
    component: <LanguagesPage/>,
  },
  {
    path: '/countries',
    component: <CountriesPage/>,
  },
  {
    path: '/tags',
    component: <TagsPage/>,
  },
]

export const authRoutes = [
  {
    path: '/article/edit/:id',
    component: <UpdateArticleComponent/>,
  },
  {
    path: '/chat/:id',
    component: <Chat/>,
  },
  {
    path: '/trip/edit/:id',
    component: <UpdateTripPage/>,
  },
  {
    path: '/edit/profile',
    component: <ProfileInfo/>,
  },
  {
    path: '/view',
    component: <ProfileViews/>,
  },
  {
    path: '/favorites',
    component: <AllFavorites/>,
  },
  {
    path: '/favorites/:type',
    component: <AllFavorites/>,
  },
  {
    path: '/trip-requests',
    component: <AllInvitations/>,
  },
  {
    path: '/articles/add',
    component: <AddArticle/>,
  },
  {
    path: '/trips/add',
    component: <CreateTrip/>,
  },
  {
    path: '/edit/profile',
    component: <ProfileInfo/>,
  },
  {
    path: '/chat',
    component: <Chat/>,
  },
  {
    path: '/user/:id/images',
    component: <UserAllImages/>,
  },
]

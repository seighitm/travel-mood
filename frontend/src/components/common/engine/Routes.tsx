import React from 'react';
import {Outlet, Route, Routes} from 'react-router-dom';
import GeneralMap from '../../maps/GeneralMap';
import useStore from "../../../store/user.store";
import {Loader} from "@mantine/core";

const UserAllImages = React.lazy(() => import('../../profile/user-images/UserAllImages'));
const Verify = React.lazy(() => import("../../sign/Verify"));
const ResetPassword = React.lazy(() => import("../../sign/ResetPassword"));
const ForgotPassword = React.lazy(() => import("../../sign/ForgotPassword"));
const LanguagesPage = React.lazy(() => import("../../ADMIN/Languages/LanguagesPage"));
const CountriesPage = React.lazy(() => import("../../ADMIN/Countries/CountriesPage"));
const TagsPage = React.lazy(() => import("../../ADMIN/Tags/TagsPage"));
const AllArticlesLayout = React.lazy(() => import('../../articles/AllArticle/AllArticlePage'));
const Layout = React.lazy(() => import('../layout/Layout'));
const ProfileInfo = React.lazy(() => import('../../profile/settings/UpdateProfile'));
const SignIn = React.lazy(() => import('../../sign/SignIn'));
const SignUpForm = React.lazy(() => import('../../sign/SignUp'));
const NotFoundTitle = React.lazy(() => import('../../not-found/NotFoundTitle'));
const AddArticle = React.lazy(() => import('../../articles/ArticleCreate/ArticleCreate'));
const ArticlePage = React.lazy(() => import('../../articles/ArticlePage/ArticlePage'));
const Chat = React.lazy(() => import('../../chat/ChatPage'));
const UpdateArticleComponent = React.lazy(() => import('../../articles/ArticleUpdate/ArticleUpdate'));
const UsersList = React.lazy(() => import('../../users/UsersList'));
const CreateTrip = React.lazy(() => import('../../trip/CreateTrip/CreateTrip'));
const AllTrips = React.lazy(() => import('../../trip/AllTripsPage/AllTrips'));
const UpdateTripPage = React.lazy(() => import('../../trip/UpdateTripPage/UpdateTripPage'));
const TripPage = React.lazy(() => import('../../trip/TripPage/TripPage'));
const AllFavorites = React.lazy(() => import('../../favorites/AllFavorites'));
const ProfileViews = React.lazy(() => import('../../profile-views/ProfileViews'));
const AllInvitations = React.lazy(() => import('../../trip-requests/AllTripRequests'));
const UserProfile = React.lazy(() => import('../../profile/UserProfile'));
const HeroContentLeft = React.lazy(() => import('../../landing/HeroComponent'));
const AdminLayout = React.lazy(() => import("../../ADMIN/layout/Layout"));
const ArticlesAll = React.lazy(() => import("../../ADMIN/Articles/components/TableArticles"));
const TripsAll = React.lazy(() => import("../../ADMIN/Trips/TripsAll"));
import UsersTot from "../../ADMIN/Trips/components/TableTrips"
const UsersAll = React.lazy(() => import("../../ADMIN/Users/components/TableUsers"));
const Home = React.lazy(() => import("../../ADMIN/Home/Home"));

export const CustomLoader = () =>
  <Loader
    style={{
      display: 'flex',
      marginLeft: 'auto',
      marginRight: 'auto',
      minWidth: '84px',
      height: '100vh',
    }}
  />

const hostRoutes = [
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
    path: 'articles',
    component: <AllArticlesLayout/>,
  },
  {
    path: 'articles/:page',
    component: <AllArticlesLayout/>,
  },
  {
    path: '/home',
    component: <AllArticlesLayout/>,
  },
  {
    path: 'users',
    component: <UsersList/>,
  },
  {
    path: 'trips',
    component: <AllTrips/>,
  },
  {
    path: 'trips/:page',
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

const authRoutes = [
  {
    path: 'article/edit/:id',
    component: <UpdateArticleComponent/>,
  },
  {
    path: 'chat/:id',
    component: <Chat/>,
  },
  {
    path: 'trip/edit/:id',
    component: <UpdateTripPage/>,
  },
  {
    path: 'favorites',
    component: <AllFavorites/>,
  },
  {
    path: 'favorites/:type',
    component: <AllFavorites/>,
  },
  {
    path: 'view',
    component: <ProfileViews/>,
  },
  {
    path: 'edit/profile',
    component: <ProfileInfo/>,
  },
  {
    path: 'trip-requests',
    component: <AllInvitations/>,
  },
];

const adminRoutes = [
  {
    path: 'admin/article/:id',
    component: <ArticlePage/>,
  },
  {
    path: 'admin/article/edit/:id',
    component: <UpdateArticleComponent/>,
  },
  {
    path: 'admin',
    component: <Home/>,
  },
  {
    path: 'admin/articles',
    component: <ArticlesAll/>,
  },
  {
    path: 'admin/trips',
    component: <UsersTot/>,
  },
  {
    path: 'admin/users',
    component: <UsersAll/>,
  },
  {
    path: 'admin/languages',
    component: <LanguagesPage/>,
  },
  {
    path: 'admin/countries',
    component: <CountriesPage/>,
  },
  {
    path: 'admin/tags',
    component: <TagsPage/>,
  },
]

const commonRoutes = [
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
    path: 'user/:id/images',
    component: <UserAllImages/>,
  },
]

const UserGuard = ({user}: any) => {
  return (user?.role == 'USER') ?
    <Layout>
      <Outlet/>
    </Layout>
    : user
      ? <NotFoundTitle/>
      : <SignIn/>
};

const AdminGuard = ({user}: any) => {
  return (user?.role == 'ADMIN') ?
    <AdminLayout>
      <Outlet/>
    </AdminLayout>
    : user
      ? <NotFoundTitle/>
      : <SignIn/>
};

const AppRoutes = () => {
  const {user} = useStore((state: any) => state);

  return (
    <Routes>
      {user && user?.role == 'ADMIN' &&
        <Route
          path=""
          element={
            <React.Suspense fallback={<CustomLoader/>}>
              <AdminGuard user={user}>
                <Outlet/>
              </AdminGuard>
            </React.Suspense>
          }
        >
          {adminRoutes.map(({path, component}: any) =>
            <Route
              path={path}
              key={path}
              element={<React.Suspense fallback={<CustomLoader/>}>{component}</React.Suspense>}
            />
          )}
          {hostRoutes.map(({path, component}: any) =>
            <Route
              path={path}
              key={path}
              element={<React.Suspense fallback={<CustomLoader/>}>{component}</React.Suspense>}
            />
          )}
          {commonRoutes.map(({path, component}: any) =>
            <Route
              path={path}
              key={path}
              element={<React.Suspense fallback={<CustomLoader/>}>{component}</React.Suspense>}
            />
          )}

        </Route>
      }


      {user && user?.role == 'USER' &&
        <Route
          path=""
          element={
            <React.Suspense fallback={<CustomLoader/>}>
              <UserGuard user={user}>
                <Outlet/>
              </UserGuard>
            </React.Suspense>
          }
        >
          {hostRoutes.map(({path, component}: any) =>
            <Route
              path={path}
              key={path}
              element={<React.Suspense fallback={<CustomLoader/>}>{component}</React.Suspense>}
            />
          )}
          {commonRoutes.map(({path, component}: any) =>
            <Route
              path={path}
              key={path}
              element={<React.Suspense fallback={<CustomLoader/>}>{component}</React.Suspense>}
            />
          )}
          {authRoutes.map(({path, component}: any) =>
            <Route
              path={path}
              key={path}
              element={<React.Suspense fallback={<CustomLoader/>}>{component}</React.Suspense>}
            />
          )}
        </Route>
      }

      {!user &&
        <Route
          path=""
          element={
            <React.Suspense fallback={<CustomLoader/>}>
              <Layout>
                <Outlet/>
              </Layout>
            </React.Suspense>
          }
        >
          {hostRoutes.map(({path, component}: any) =>
            <Route
              path={path}
              key={path}
              element={<React.Suspense fallback={<CustomLoader/>}>{component}</React.Suspense>}
            />
          )}
        </Route>
      }

      {!user &&
        <Route
          path=""
          element={
            <React.Suspense fallback={<CustomLoader/>}>
              <Layout>
                <SignIn/>
              </Layout>
            </React.Suspense>
          }
        >
          {commonRoutes.map(({path, component}: any) =>
            <Route
              path={path}
              key={path}
              element={<React.Suspense fallback={<CustomLoader/>}>{component}</React.Suspense>}
            />
          )}
          {authRoutes.map(({path, component}: any) =>
            <Route
              path={path}
              key={path}
              element={<React.Suspense fallback={<CustomLoader/>}>{component}</React.Suspense>}
            />
          )}
          {adminRoutes.map(({path, component}: any) =>
            <Route
              path={path}
              key={path}
              element={<React.Suspense fallback={<CustomLoader/>}>{component}</React.Suspense>}
            />
          )}
        </Route>
      }
      <Route
        path="*"
        element={
          <React.Suspense fallback={<CustomLoader/>}>
            <NotFoundTitle/>
          </React.Suspense>
        }
      />
    </Routes>
  );
};

export default AppRoutes;

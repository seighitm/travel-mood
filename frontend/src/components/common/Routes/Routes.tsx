import React from 'react';
import {Outlet, Route, Routes, useNavigate} from 'react-router-dom';
import useStore from '../../../store/user.store';
import {CustomLoader} from '../CustomLoader';
import {ROLE} from '../../../types/enums';
import {adminRoutes, authRoutes, hostRoutes, userRoutes} from './RoutesUrl';
import {isNullOrUndefined} from '../../../utils/primitive-checks';
import UserLayout from '../../layouts/UserLayout/UserLayout';
import NotFoundTitle from '../NotFoundTitle';
import AdminLayout from '../../layouts/AdminLayout/Layout';
import HeroSection from '../HeroSection';
import {IUser} from "../../../types/IUser";

const SignIn = React.lazy(() => import('../../sign/SignIn'));

const UserGuard = ({user}: { user: IUser } | any) => {
  const navigate = useNavigate();
  if (isNullOrUndefined(user)) {
    navigate('/auth/login');
  }

  return [ROLE.USER, ROLE.MODERATOR].includes(user?.role) ? (
    <UserLayout>
      <Outlet/>
    </UserLayout>
  ) : user ? (
    <NotFoundTitle/>
  ) : (
    <UserLayout>
      <SignIn/>
    </UserLayout>
  );
};

const AdminGuard = ({user}: { user: IUser } | any) => {
  const navigate = useNavigate();
  if (isNullOrUndefined(user)) {
    navigate('/auth/login');
  }

  return user?.role == ROLE.ADMIN ? (
    <AdminLayout>
      <Outlet/>
    </AdminLayout>
  ) : user ? (
    <NotFoundTitle/>
  ) : (
    <UserLayout>
      <SignIn/>
    </UserLayout>
  );
};

const AppRoutes = () => {
  const {user, isLoadingUser} = useStore((state: any) => state);
  if ((isNullOrUndefined(user) && isLoadingUser)) return <CustomLoader/>;

  return (
    <Routes>
      <Route
        path=""
        element={
          <React.Suspense fallback={<CustomLoader/>}>
            {user?.role == ROLE.ADMIN ? (
              <AdminLayout user={user}>
                <Outlet/>
              </AdminLayout>
            ) : (
              <UserLayout user={user}>
                <Outlet/>
              </UserLayout>
            )}
          </React.Suspense>
        }
      >
        {authRoutes.map(({path, component}: any) => (
          <Route
            path={path}
            key={path}
            element={<React.Suspense fallback={<CustomLoader/>}>{component}</React.Suspense>}
          />
        ))}
        <Route
          path={'/'}
          key={'/'}
          element={
            <React.Suspense fallback={<CustomLoader/>}>
              <HeroSection/>
            </React.Suspense>
          }
        />
      </Route>

      {/*{user && user?.role == ROLE.ADMIN &&*/}
      {!isNullOrUndefined(user) && (
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
          {adminRoutes.map(({path, component}: any) => (
            <Route
              // path={path != '' ? 'admin' + path : path}
              path={path != '' ? 'admin' + path : path}
              key={path}
              element={<React.Suspense fallback={<CustomLoader/>}>{component}</React.Suspense>}
            />
          ))}
          {hostRoutes.map(({path, component}: any) => (
            <Route
              path={'admin' + path}
              key={path}
              element={<React.Suspense fallback={<CustomLoader/>}>{component}</React.Suspense>}
            />
          ))}
          {userRoutes.map(({path, component}: any) => (
            <Route
              path={'admin' + path}
              key={path}
              element={<React.Suspense fallback={<CustomLoader/>}>{component}</React.Suspense>}
            />
          ))}
        </Route>
      )}
      {/*}*/}

      {/*{user && (user?.role == ROLE.USER || user?.role == ROLE.MODERATOR) &&*/}
      {!isNullOrUndefined(user) && (
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
          {hostRoutes.map(({path, component}: any) => (
            <Route
              path={path}
              key={path}
              element={<React.Suspense fallback={<CustomLoader/>}>{component}</React.Suspense>}
            />
          ))}
          {userRoutes.map(({path, component}: any) => (
            <Route
              path={path}
              key={path}
              element={<React.Suspense fallback={<CustomLoader/>}>{component}</React.Suspense>}
            />
          ))}
        </Route>
      )}
      {/*}*/}

      <Route
        path=""
        element={
          <React.Suspense fallback={<CustomLoader/>}>
            <UserLayout>
              <Outlet/>
            </UserLayout>
          </React.Suspense>
        }
      >
        {hostRoutes.map(({path, component}: any) => (
          <Route
            path={path}
            key={path}
            element={<React.Suspense fallback={<CustomLoader/>}>{component}</React.Suspense>}
          />
        ))}
      </Route>

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

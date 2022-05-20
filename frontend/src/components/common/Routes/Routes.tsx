import React from 'react';
import {Outlet, Route, Routes} from 'react-router-dom';
import useStore from "../../../store/user.store";
import {CustomLoader} from "../CustomLoader";
import {ROLE} from "../../../types/enums";
import {adminRoutes, authRoutes, hostRoutes} from "./RoutesUrl";

const Layout = React.lazy(() => import('../layout/Layout'));
const SignIn = React.lazy(() => import('../../sign/SignIn'));
const NotFoundTitle = React.lazy(() => import('../../not-found/NotFoundTitle'));
const AdminLayout = React.lazy(() => import("../../ADMIN/layout/Layout"));

const UserGuard = ({user}: any) => {
  return (user?.role == ROLE.USER) ?
    <Layout>
      <Outlet/>
    </Layout>
    : user
      ? <NotFoundTitle/>
      : <SignIn/>
};

const AdminGuard = ({user}: any) => {
  return (user?.role == ROLE.ADMIN)
    ? <AdminLayout>
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
      {user && user?.role == ROLE.ADMIN &&
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
              path={'admin' + path}
              key={path}
              element={<React.Suspense fallback={<CustomLoader/>}>{component}</React.Suspense>}
            />
          )}
          {hostRoutes.map(({path, component}: any) =>
            <Route
              path={'admin' + path}
              key={path}
              element={<React.Suspense fallback={<CustomLoader/>}>{component}</React.Suspense>}
            />
          )}
          {authRoutes.map(({path, component}: any) =>
            <Route
              path={'admin' + path}
              key={path}
              element={<React.Suspense fallback={<CustomLoader/>}>{component}</React.Suspense>}
            />
          )}

        </Route>
      }

      {user && user?.role == ROLE.USER &&
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
          {authRoutes.map(({path, component}: any) =>
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

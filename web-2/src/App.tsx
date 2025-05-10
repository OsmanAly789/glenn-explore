import { Routes } from 'react-router';
import { Route } from 'react-router';
import { routes } from './routes';
import { RouteConfig } from './routes/types';
import { ProtectedRoute } from './routes/protected';
import { useAuth } from './contexts/AuthContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

function renderRouter(routeList: RouteConfig[] = routes) {
  return routeList.map((route) => {
    const routeElement = route.public === false ? (
      <ProtectedRoute>{route.element}</ProtectedRoute>
    ) : route.element;

    if (route.children) {
      return (
        <Route key={route.path} path={route.path} element={routeElement}>
          {renderRouter(route.children)}
        </Route>
      );
    }

    return (
      <Route key={route.path} path={route.path} element={routeElement} />
    );
  });
}

function App() {
  const { hasCheckedUser } = useAuth();

  // Show nothing (or a splash screen) while checking authentication
  if (!hasCheckedUser) {
    return null; // Or return <SplashScreen /> if you have one
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Routes>
        {renderRouter(routes)}
      </Routes>
    </LocalizationProvider>
  );
}

export default App

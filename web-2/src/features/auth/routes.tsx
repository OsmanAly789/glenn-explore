import { RouteConfig } from '../../routes/types';
import { LoginPage } from './pages/Login';

export const authRoutes: RouteConfig = {
  path: 'craft/auth',
  public: true,
  children: [
    {
      path: 'login',
      element: <LoginPage />,
      public: true
    }
  ]
};

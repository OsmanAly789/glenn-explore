import { Person } from '@mui/icons-material';
import { RouteConfig } from '../../routes/types';
import { UsersPage } from './pages/UsersPage';

export const usersRoutes: RouteConfig[] = [{
  path: 'users',
  public: false,
  element: <UsersPage />,
  sidebar: {
    icon: Person,
    label: 'Users'
  }
}];

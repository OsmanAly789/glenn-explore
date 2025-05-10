import { Dashboard } from '@mui/icons-material';
import { RouteConfig } from '../../routes/types';
import DashboardPage from './pages/Dashboard';

export const dashboardRoutes: RouteConfig[] = [{
  path: 'dashboard',
  public: false,
  element: <DashboardPage />,
  sidebar: {
    icon: Dashboard,
    label: 'Dashboard'
  }
}];

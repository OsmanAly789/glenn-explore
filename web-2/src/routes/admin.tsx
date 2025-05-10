import { RouteConfig } from './types';
import { ProtectedRoute } from './protected';
import AdminLayout from '../layouts/AdminLayout';
import { dashboardRoutes } from '../features/dashboard/routes';
import { usersRoutes } from '../features/users/routes';
import Game from '../features/game';
import { Gamepad } from '@mui/icons-material';
export const adminRoutes: RouteConfig = {
    path: 'admin',
    element: (
        <ProtectedRoute>
            <AdminLayout />
        </ProtectedRoute>
    ),
    children: [
        ...dashboardRoutes,
        ...usersRoutes,
        {
            path: 'game',
            element: <Game />,
            sidebar: {
                icon: Gamepad,
                label: 'Game'
            }
        }
    ]
};

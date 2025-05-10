import { authRoutes } from '../features/auth/routes';
import Game from '../features/game';
import { adminRoutes } from './admin';
import { ProtectedRoute } from './protected';
import { RouteConfig } from './types';

export const routes: RouteConfig[] = [
  authRoutes,  // First: public routes
  adminRoutes, // Then: admin routes with layout
  {
    path: '/craft/game',
    element: <ProtectedRoute><Game /></ProtectedRoute>,
  }
];

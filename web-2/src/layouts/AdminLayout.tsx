import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    Divider,
    Avatar,
    useTheme,
    useMediaQuery,
} from '@mui/material'

import {
    Menu as MenuIcon,
    Notifications as NotificationsIcon,
} from '@mui/icons-material'

import { adminRoutes } from '../routes/admin'
import { RouteConfig } from '../routes/types'
const drawerWidth = 240

export default function AdminLayout() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const location = useLocation()
    const navigate = useNavigate()

    const drawer = (
        <Box sx={{ overflow: 'auto' }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>A</Avatar>
                <Typography variant="subtitle1" fontWeight="medium">Admin Panel</Typography>
            </Box>
            <Divider />
            <List>
                {(adminRoutes.children as RouteConfig[])?.filter(route => route.sidebar).map((route) => {
                    const Icon = route.sidebar?.icon;
                    const isSelected = location.pathname === `/admin/${route.path}`;
                    console.log(route)
                    return (
                        <ListItem key={route.path} disablePadding>
                            <ListItemButton
                                selected={isSelected}
                                sx={{ mx: 1 }}
                                onClick={() => {
                                    navigate(`/admin/${route.path}`)
                                    if (isMobile) setMobileOpen(false)
                                }}
                            >
                                <ListItemIcon sx={{ color: isSelected ? 'primary.main' : 'inherit' }}>
                                    {Icon && <Icon />}
                                </ListItemIcon>
                                <ListItemText
                                    primary={route.sidebar?.label}
                                    sx={{ '& .MuiListItemText-primary': { fontWeight: isSelected ? 600 : 400 } }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    )

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="h1">Glenn</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton color="inherit" size="small">
                            <NotificationsIcon />
                        </IconButton>
                        <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    mt: '64px', // Height of AppBar
                    height: '100vh',
                    overflow: 'auto',
                    bgcolor: 'background.default',
                }}
            >
                <Outlet />
            </Box>
        </Box>
    )
}
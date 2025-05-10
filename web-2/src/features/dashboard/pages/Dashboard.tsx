import {
    Typography,
    Button,
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Card,
    CardContent,
    Avatar,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material'

import {
    TrendingUp as TrendingUpIcon,
    People as PeopleIcon,
    AttachMoney as AttachMoneyIcon,
    Assignment as AssignmentIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon
} from '@mui/icons-material'


function DashboardPage() {



    const recentActivity = [
        { user: 'John Doe', action: 'Created new project', time: '2 hours ago' },
        { user: 'Jane Smith', action: 'Updated profile', time: '4 hours ago' },
        { user: 'Mike Johnson', action: 'Completed task', time: '5 hours ago' }
    ]

    const stats = [
        { title: 'Total Users', value: '1,285', icon: <PeopleIcon />, color: 'primary.main' },
        { title: 'Revenue', value: '$12,485', icon: <AttachMoneyIcon />, color: 'secondary.main' },
        { title: 'Tasks', value: '64', icon: <AssignmentIcon />, color: 'success.main' },
        { title: 'Growth', value: '+15%', icon: <TrendingUpIcon />, color: 'info.main' }
    ]


    return (


        <Box sx={{ '& > *': { mb: 3 } }}>
            <Box
                display="grid"
                gap={2}
                sx={{
                    gridTemplateColumns: {
                        xs: 'repeat(2, 1fr)',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(4, 1fr)'
                    },
                    mb: 3
                }}>
                {stats.map((stat) => (
                    <Box key={stat.title}>
                        <Card>
                            <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                    sx={{
                                        bgcolor: stat.color,
                                        width: 40,
                                        height: 40,
                                        fontSize: '1.25rem'
                                    }}
                                >
                                    {stat.icon}
                                </Avatar>
                                <Box>
                                    <Typography color="text.secondary" variant="body2">
                                        {stat.title}
                                    </Typography>
                                    <Typography variant="h6" fontWeight="medium">
                                        {stat.value}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                ))}

                <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / span 3' } }}>
                    <Card>
                        <CardContent>
                            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6">Recent Orders</Typography>
                                <Button size="small" endIcon={<KeyboardArrowRightIcon />}>View all</Button>
                            </Box>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Order ID</TableCell>
                                            <TableCell>Customer</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell align="right">Amount</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <TableRow key={index}>
                                                <TableCell>#{(1000 + index).toString()}</TableCell>
                                                <TableCell>Customer {index + 1}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        size="small"
                                                        label={index % 2 === 0 ? 'Completed' : 'Pending'}
                                                        color={index % 2 === 0 ? 'success' : 'warning'}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">${(99 + index * 10).toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Box>

                <Box>
                    <Card>
                        <CardContent>
                            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6">Recent Activity</Typography>
                                <Button size="small" endIcon={<KeyboardArrowRightIcon />}>View all</Button>
                            </Box>
                            <List>
                                {recentActivity.map((activity, index) => (
                                    <ListItem
                                        key={index}
                                        disablePadding
                                        sx={{ mb: index !== recentActivity.length - 1 ? 2 : 0 }}
                                    >
                                        <ListItemIcon>
                                            <Avatar sx={{ width: 32, height: 32 }}>
                                                {activity.user.charAt(0)}
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={activity.user}
                                            secondary={
                                                <>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        {activity.action}
                                                    </Typography>
                                                    {' — '}
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        {activity.time}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Box>
    )
}

export default DashboardPage

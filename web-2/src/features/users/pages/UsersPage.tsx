import { useState, useCallback } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { UsersGrid } from '../components/UsersGrid';
import { CreateUserDialog } from '../components/CreateUserDialog/CreateUserDialog';
import { useGetApiUsers } from '../../../api/generated/user/user';
import { GetApiUsersParams } from '../../../api/generated/model';

export function UsersPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [queryParams, setQueryParams] = useState<GetApiUsersParams>({
    Page: 1,
    PageSize: 10,
  });

  const { data, isLoading, refetch } = useGetApiUsers(queryParams);

  const handleParamsChange = useCallback((params: {
    page: number;
    pageSize: number;
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
    searchTerm?: string;
  }) => {
    setQueryParams({
      ...queryParams,
      Page: params.page,
      PageSize: params.pageSize,
      SortBy: params.sortField,
      SortDescending: params.sortDirection === 'desc',
      SearchTerm: params.searchTerm,
    });
  }, [queryParams]);

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Users
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Create User
        </Button>
      </Box>

      <Stack
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <UsersGrid
          users={data?.items ?? []}
          totalUsers={data?.totalCount ?? 0}
          loading={isLoading}
          onParamsChange={handleParamsChange}
          onRefetch={refetch}
        />
      </Stack>

      <CreateUserDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={refetch}
      />
    </Box>
  );
}

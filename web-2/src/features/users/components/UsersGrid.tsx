import { useState } from 'react';

import { useSnackbar } from 'notistack';
import { GridColDef, GridRowParams, GridValueFormatter } from '@mui/x-data-grid';
import { BaseDataGrid, GridParams } from '../../../components/common/BaseDataGrid';
import { useDeleteApiUsersId } from '../../../api/generated/user/user';
import { UserResponseDto } from '../../../api/generated/model';
import { EditUserDialog } from './EditUserDialog/EditUserDialog';

const columns: GridColDef[] = [
  { 
    field: 'id', 
    headerName: 'ID', 
    width: 90,
    type: 'string',
  },
  { 
    field: 'email', 
    headerName: 'Email', 
    flex: 1,
    type: 'string',
  },
  { 
    field: 'firstName', 
    headerName: 'First Name', 
    flex: 1,
    type: 'string',
  },
  { 
    field: 'lastName', 
    headerName: 'Last Name', 
    flex: 1,
    type: 'string',
  },
  {
    field: 'createdAt',
    headerName: 'Created At',
    flex: 1,
    type: 'dateTime',
    valueFormatter: ((params: { value: string | null }) => {
      if (!params?.value) return '';
      return new Date(params.value).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    }) as GridValueFormatter,
  },
  {
    field: 'lastLoginAt',
    headerName: 'Last Login',
    flex: 1,
    type: 'dateTime',
    valueFormatter: ((params: { value: string | null }) => {
      if (!params?.value) return 'Never';
      return new Date(params.value).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    }) as GridValueFormatter,
  }
];

interface UsersGridProps {
  users: UserResponseDto[];
  totalUsers: number;
  loading: boolean;
  onParamsChange: (params: GridParams) => void;
  onRefetch: () => void;
}

export function UsersGrid({ users, totalUsers, loading, onParamsChange, onRefetch }: UsersGridProps) {
  const [selectedUser, setSelectedUser] = useState<UserResponseDto | null>(null);

  const { enqueueSnackbar } = useSnackbar();

  const { mutate: deleteUser } = useDeleteApiUsersId({
    mutation: {
      onSuccess: () => {
        enqueueSnackbar('User deleted successfully', { variant: 'success' });
        onRefetch?.();
      },
      onError: (error) => {
        console.error('Error deleting user:', error);
        enqueueSnackbar('Failed to delete user', { variant: 'error' });
      },
    },
  });

  return (
    <>
      <BaseDataGrid<UserResponseDto>
        columns={columns}
        rows={users}
        totalRows={totalUsers}
        loading={loading}
        onParamsChange={onParamsChange}
        onRowClick={(params: GridRowParams<UserResponseDto>) => setSelectedUser(params.row)}
        onOpenEdit={(row: UserResponseDto) => setSelectedUser(row)}
        onDelete={(user) => deleteUser({ id: user.id! })}
      />
      
      {selectedUser && (
        <EditUserDialog
          open={!!selectedUser}
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSuccess={onRefetch}
        />
      )}
    </>
  );
}

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { usePutApiUsersId } from '../../../../api/generated/user/user';
import { UserResponseDto } from '../../../../api/generated/model';
import { EditUserForm } from './EditUserForm';

interface EditUserDialogProps {
  open: boolean;
  onClose: () => void;
  user: UserResponseDto;
  onSuccess?: () => void;
}

export function EditUserDialog({ open, onClose, user, onSuccess }: EditUserDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: updateUser, isPending } = usePutApiUsersId({
    mutation: {
      onSuccess: () => {
        enqueueSnackbar('User updated successfully', { variant: 'success' });
        onSuccess?.();
        onClose();
      },
      onError: (error) => {
        console.error('Error updating user:', error);
        enqueueSnackbar('Failed to update user', { variant: 'error' });
      },
    },
  });

  const handleSubmit = (data: Omit<UserResponseDto, 'id'>) => {
    if (!user.id) return;
    updateUser({ id: user.id, data });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ pb: 1 }}>Edit User</DialogTitle>
      <DialogContent sx={{ pt: '8px !important' }}>
        <DialogContentText sx={{ mb: 2, fontSize: '0.875rem' }}>
          Update user information using the form below.
        </DialogContentText>
        <EditUserForm
          user={user}
          onClose={onClose}
          onSubmit={handleSubmit}
          isLoading={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}

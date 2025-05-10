import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { usePostApiUsers } from '../../../../api/generated/user/user';
import { CreateUserForm } from './CreateUserForm';

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateUserDialog({ open, onClose, onSuccess }: CreateUserDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: createUser, isPending } = usePostApiUsers({
    mutation: {
      onSuccess: () => {
        enqueueSnackbar('User created successfully', { variant: 'success' });
        onSuccess?.();
        onClose();
      },
      onError: (error) => {
        console.error('Error creating user:', error);
        enqueueSnackbar('Failed to create user', { variant: 'error' });
      },
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ pb: 1 }}>Create User</DialogTitle>
      <DialogContent sx={{ pt: '8px !important' }}>
        <DialogContentText sx={{ mb: 2, fontSize: '0.875rem' }}>
          Create a new user by filling out the form below.
        </DialogContentText>
        <CreateUserForm
          onSubmit={(data) => createUser({ data })}
          onClose={onClose}
          isLoading={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}

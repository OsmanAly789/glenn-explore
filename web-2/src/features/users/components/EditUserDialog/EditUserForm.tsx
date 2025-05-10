import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, Stack, TextField, FormControlLabel, Switch } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { UpdateUserCommand, UserResponseDto } from '../../../../api/generated/model';

const schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface EditUserFormProps {
  user: UserResponseDto;
  onSubmit: (data: UpdateUserCommand) => void;
  onClose: () => void;
  isLoading: boolean;

}

export function EditUserForm({ user, onSubmit, onClose, isLoading }: EditUserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      isActive: user.isActive,
    },
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ width: '100%' }}
    >
      <Stack spacing={2}>
        <TextField
          {...register('firstName')}
          label="First Name"
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
          fullWidth
          required
          size="small"
          inputProps={{ 'aria-label': 'First Name' }}
        />
        <TextField
          {...register('lastName')}
          label="Last Name"
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
          fullWidth
          required
          size="small"
          inputProps={{ 'aria-label': 'Last Name' }}
        />
        <TextField
          {...register('email')}
          label="Email"
          type="email"
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth
          required
          size="small"
          inputProps={{ 'aria-label': 'Email' }}
        />
        <FormControlLabel
          control={
            <Switch
              {...register('isActive')}
              defaultChecked={user.isActive}
              size="small"
            />
          }
          label="Active"
          sx={{ mb: 1 }}
        />
      </Stack>

      <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 3 }}>
        <Button type="button" variant="text" size="small" onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          type="submit"
          variant="contained"
          loading={isLoading}
          size="small"
        >
          Save Changes
        </LoadingButton>
      </Stack>
    </Box>
  );
}

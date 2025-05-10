import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { CreateUserCommand } from '../../../../api/generated/model';

const schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

type FormData = z.infer<typeof schema>;

interface CreateUserFormProps {
  onSubmit: (data: CreateUserCommand) => void;
  onClose: () => void;
  isLoading: boolean;
}

export function CreateUserForm({ onSubmit, onClose, isLoading }: CreateUserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
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
        <TextField
          {...register('password')}
          label="Password"
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message}
          fullWidth
          required
          size="small"
          inputProps={{ 'aria-label': 'Password' }}
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
          Create User
        </LoadingButton>
      </Stack>
    </Box>
  );
}

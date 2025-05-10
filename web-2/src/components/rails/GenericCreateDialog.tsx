import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { ZodSchema } from 'zod';
import { GenericForm } from './GenericForm';
import { CrudHooks, IEntity } from './types';
import { ColumnConfig } from './column-config';
import { useState } from 'react';

interface GenericCreateDialogProps<TCreateCommand> {
  open: boolean;
  onClose: () => void;
  entityName: string;
  schema: ZodSchema;
  useCreate: CrudHooks<any, TCreateCommand, any>['useCreate'];
  onSuccess?: () => void;
  columns: ColumnConfig<any, any>[];
}

export function GenericCreateDialog<TCreateCommand>({
  open,
  onClose,
  entityName,
  schema,
  useCreate,
  onSuccess,
  columns
}: GenericCreateDialogProps<TCreateCommand>) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { enqueueSnackbar } = useSnackbar();
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>();

  const { mutate: createEntity, isPending } = useCreate({
    mutation: {
      onSuccess: () => {
        enqueueSnackbar(`${entityName} created successfully`, { variant: 'success' });
        onSuccess?.();
        onClose();
      },
      onError: (error: any) => {
        console.error(`Error creating ${entityName.toLowerCase()}:`, error);
        if (error.response?.data?.errors) {
          setServerErrors(error.response.data.errors);
        } else {
          enqueueSnackbar(`Failed to create ${entityName.toLowerCase()}`, { variant: 'error' });
        }
      },
    },
  });

  const handleSubmit = (data: TCreateCommand) => {
    setServerErrors(undefined);
    createEntity({ data });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Create {entityName}</DialogTitle>
      <DialogContent>
        <GenericForm
          schema={schema}
          onSubmit={handleSubmit}
          onClose={onClose}
          isLoading={isPending}
          submitLabel={`Create ${entityName}`}
          columns={columns}
          serverErrors={serverErrors}
        />
      </DialogContent>
    </Dialog>
  );
} 
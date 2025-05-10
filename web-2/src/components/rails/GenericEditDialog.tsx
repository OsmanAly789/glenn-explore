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

interface GenericEditDialogProps<TEntity extends IEntity, TUpdateCommand> {
  open: boolean;
  onClose: () => void;
  entity: TEntity;
  entityName: string;
  schema: ZodSchema;
  useUpdate: CrudHooks<TEntity, any, TUpdateCommand>['useUpdate'];
  onSuccess?: () => void;
  columns: ColumnConfig<TEntity, keyof TEntity>[];
}

export function GenericEditDialog<TEntity extends IEntity, TUpdateCommand>({
  open,
  onClose,
  entity,
  entityName,
  schema,
  useUpdate,
  onSuccess,
  columns
}: GenericEditDialogProps<TEntity, TUpdateCommand>) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { enqueueSnackbar } = useSnackbar();
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>();

  const { mutate: updateEntity, isPending } = useUpdate({
    mutation: {
      onSuccess: () => {
        enqueueSnackbar(`${entityName} updated successfully`, { variant: 'success' });
        onSuccess?.();
        onClose();
      },
      onError: (error: any) => {
        console.error(`Error updating ${entityName.toLowerCase()}:`, error);
        if (error.response?.data?.errors) {
          setServerErrors(error.response.data.errors);
        } else {
          enqueueSnackbar(`Failed to update ${entityName.toLowerCase()}`, { variant: 'error' });
        }
      },
    },
  });

  const handleSubmit = (data: TUpdateCommand) => {
    setServerErrors(undefined);
    const dataWithId = {
      ...data,
      id: entity.id
    };
    updateEntity({ id: entity.id!, data: dataWithId });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Edit {entityName}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Update the details of this {entityName.toLowerCase()}.
        </DialogContentText>
        <GenericForm
          schema={schema}
          onSubmit={handleSubmit}
          onClose={onClose}
          isLoading={isPending}
          submitLabel={`Update ${entityName}`}
          defaultValues={{ ...entity, id: entity.id }}
          columns={columns}
          serverErrors={serverErrors}
        />
      </DialogContent>
    </Dialog>
  );
} 
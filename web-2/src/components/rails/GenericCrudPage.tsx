import { useState, useCallback } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';
import { GridRowParams } from '@mui/x-data-grid';
import { BaseDataGrid, GridParams } from '../common/BaseDataGrid';
import { GenericCrudPageProps, IEntity } from './types';
import { GenericCreateDialog } from './GenericCreateDialog';
import { GenericEditDialog } from './GenericEditDialog';
import { toGridColumns, toZodSchema } from './column-config';

export function GenericCrudPage<
  TEntity extends IEntity,
  TCreateCommand,
  TUpdateCommand
>({
  entityName,
  entityNamePlural,
  hooks,
  columns,
  gridProps
}: GenericCrudPageProps<TEntity, TCreateCommand, TUpdateCommand>) {
  // State
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<TEntity | null>(null);
  const [queryParams, setQueryParams] = useState<any>({
    Page: 1,
    PageSize: 10,
  });

  const { enqueueSnackbar } = useSnackbar();

  // Convert columns to grid columns and schemas
  const gridColumns = toGridColumns(columns);
  const formSchema = toZodSchema(columns);

  // Data fetching
  const { data, isLoading, refetch } = hooks.useList(queryParams);

  // Mutations
  const { mutate: deleteEntity } = hooks.useDelete({
    mutation: {
      onSuccess: () => {
        enqueueSnackbar(`${entityName} deleted successfully`, { variant: 'success' });
        refetch();
      },
      onError: (error) => {
        console.error(`Error deleting ${entityName.toLowerCase()}:`, error);
        enqueueSnackbar(`Failed to delete ${entityName.toLowerCase()}`, { variant: 'error' });
      },
    },
  });

  // Handlers
  const handleParamsChange = useCallback((params: GridParams) => {
    setQueryParams({
      ...queryParams,
      Page: params.page,
      PageSize: params.pageSize,
      SortBy: params.sortField,
      SortDescending: params.sortDirection === 'desc',
      SearchTerm: params.searchTerm,
    });
  }, [queryParams]);

  const handleRowClick = (params: GridRowParams<TEntity>) => {
    if (gridProps?.onRowClick) {
      gridProps.onRowClick(params);
    } else {
      setSelectedEntity(params.row);
    }
  };

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          {entityNamePlural}
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Create {entityName}
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
        <BaseDataGrid<TEntity>
          columns={gridColumns}
          rows={data?.items ?? []}
          totalRows={data?.totalCount ?? 0}
          loading={isLoading}
          onParamsChange={handleParamsChange}
          onRowClick={handleRowClick}
          onOpenEdit={(entity: TEntity) => setSelectedEntity(entity)}
          onDelete={(entity) => deleteEntity({ id: entity.id! })}
        />
      </Stack>

      <GenericCreateDialog<TCreateCommand>
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        entityName={entityName}
        schema={formSchema}
        useCreate={hooks.useCreate}
        onSuccess={refetch}
        columns={columns}
      />

      {selectedEntity && (
        <GenericEditDialog<TEntity, TUpdateCommand>
          open={!!selectedEntity}
          onClose={() => setSelectedEntity(null)}
          entity={selectedEntity}
          entityName={entityName}
          schema={formSchema}
          useUpdate={hooks.useUpdate}
          onSuccess={refetch}
          columns={columns}
        />
      )}
    </Box>
  );
} 
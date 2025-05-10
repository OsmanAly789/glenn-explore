import { DataGrid, GridColDef, GridSortModel, GridFilterModel, GridPaginationModel, GridRowParams, GridValidRowModel, GridRenderCellParams } from '@mui/x-data-grid';
import { IconButton, Paper, Stack } from '@mui/material';
import { ButtonWithConfirm } from './ButtonWithConfirm';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useCallback, MouseEvent } from 'react';

export interface GridParams {
  page: number;
  pageSize: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  searchTerm?: string;
}

export interface BaseDataGridProps<T extends GridValidRowModel> {
  columns: GridColDef[];
  rows: T[];
  totalRows: number;
  loading?: boolean;
  onParamsChange: (params: GridParams) => void;
  defaultPageSize?: number;
  onRowClick?: (params: GridRowParams<T>) => void;
  onOpenEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}

export function BaseDataGrid<T extends GridValidRowModel>({
  onDelete,
  onOpenEdit,
  columns,
  rows,
  totalRows,
  loading,
  onParamsChange,
  defaultPageSize = 10,
  onRowClick,
}: BaseDataGridProps<T>) {
  const handleActionClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  const actionsColumn: GridColDef = {
    field: 'actions',
    headerName: 'Actions',
    width: 120,
    sortable: false,
    filterable: false,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params: GridRenderCellParams<T>) => (
      <Stack 
        direction="row" 
        spacing={1} 
        onClick={handleActionClick}
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="100%"
      >
        {onOpenEdit && (
          <IconButton
            size="small"
            onClick={() => onOpenEdit(params.row)}
            color="primary"
            sx={{ 
              '&:hover': { 
                backgroundColor: 'action.hover' 
              }
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )}
        {onDelete && (
          <ButtonWithConfirm
            size="small"
            color="error"
            sx={{ 
              minWidth: 0,
              '&:hover': { 
                backgroundColor: 'action.hover' 
              }
            }}
            dialogTitle="Delete Item"
            dialogContent="Are you sure you want to delete this item?"
            onConfirm={() => onDelete(params.row)}
          >
            <DeleteIcon fontSize="small" />
          </ButtonWithConfirm>
        )}
      </Stack>
    ),
  };

  const allColumns = [...columns];
  if (onOpenEdit || onDelete) {
    allColumns.push(actionsColumn);
  }
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: defaultPageSize,
  });

  const handleSortModelChange = useCallback((model: GridSortModel) => {
    if (model.length > 0) {
      const { field, sort } = model[0];
      onParamsChange({
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
        sortField: field,
        sortDirection: sort as 'asc' | 'desc',
      });
    }
  }, [onParamsChange, paginationModel]);

  const handleFilterModelChange = useCallback((model: GridFilterModel) => {
    const searchTerm = model.quickFilterValues?.[0];
    onParamsChange({
      page: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
      searchTerm,
    });
  }, [onParamsChange, paginationModel]);

  const handlePaginationModelChange = useCallback((model: GridPaginationModel) => {
    setPaginationModel(model);
    onParamsChange({
      page: model.page + 1,
      pageSize: model.pageSize,
    });
  }, [onParamsChange]);

  return (
    <Paper elevation={2} sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={allColumns}
        rowCount={totalRows}
        loading={loading}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        paginationMode="server"
        sortingMode="server"
        filterMode="server"
        onPaginationModelChange={handlePaginationModelChange}
        onSortModelChange={handleSortModelChange}
        onFilterModelChange={handleFilterModelChange}
        disableRowSelectionOnClick
        onRowClick={onRowClick}
        density="compact"
        rowHeight={40}
        sx={{
          '& .MuiDataGrid-cell': {
            py: '4px',
          },
        }}
      />
    </Paper>
  );
}

import { GridColDef, GridRowParams } from '@mui/x-data-grid';
import { ZodSchema } from 'zod';
import { ColumnConfig } from './column-config';

export interface IEntity {
  id?: string;
}

export interface CrudHooks<TEntity extends IEntity, TCreateCommand, TUpdateCommand> {
  useList: {
    (params: any): {
      data?: { items: TEntity[]; totalCount: number };
      isLoading: boolean;
      refetch: () => void;
    };
  };
  useCreate: {
    (options: {
      mutation: {
        onSuccess?: () => void;
        onError?: (error: any) => void;
      };
    }): {
      mutate: (params: { data: TCreateCommand }) => void;
      isPending: boolean;
    };
  };
  useUpdate: {
    (options: {
      mutation: {
        onSuccess?: () => void;
        onError?: (error: any) => void;
      };
    }): {
      mutate: (params: { id: string; data: TUpdateCommand }) => void;
      isPending: boolean;
    };
  };
  useDelete: {
    (options: {
      mutation: {
        onSuccess?: () => void;
        onError?: (error: any) => void;
      };
    }): {
      mutate: (params: { id: string }) => void;
      isPending: boolean;
    };
  };
}

export interface GenericCrudPageProps<
  TEntity extends IEntity,
  TCreateCommand,
  TUpdateCommand
> {
  // Display
  entityName: string;
  entityNamePlural: string;

  // Column Configuration
  columns: ColumnConfig<TEntity, keyof TEntity>[];

  // Data & Operations
  hooks: CrudHooks<TEntity, TCreateCommand, TUpdateCommand>;

  // Form Configuration
  createFormSchema: ZodSchema;
  editFormSchema: ZodSchema;

  // Optional customization
  gridProps?: {
    onRowClick?: (params: GridRowParams<TEntity>) => void;
  };
} 
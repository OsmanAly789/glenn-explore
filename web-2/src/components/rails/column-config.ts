import { z } from 'zod';
import { GridColDef } from '@mui/x-data-grid';
import { ReactNode } from 'react';

export type ColumnType = 'text' | 'boolean' | 'date' | 'select' | 'textarea' | 'number' | 'custom';

export interface CustomFieldProps {
  value: any;
  onChange: (value: any) => void;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

export interface ColumnConfig<T, K extends keyof T> {
  key: K;
  label: string;
  type: ColumnType;
  zodSchema: z.ZodType;
  gridOptions?: Partial<Omit<GridColDef, 'field'>>;
  customFieldRender?: (props: CustomFieldProps) => ReactNode;
  selectOptions?: { value: any; label: string }[];
}

export function toZodSchema<T>(columns: ColumnConfig<T, keyof T>[]) {
  return z.object(
    columns.reduce((acc, col) => {
      acc[col.key] = col.zodSchema;
      return acc;
    }, {} as Record<keyof T, z.ZodType>)
  );
}

export function toGridColumns<T>(columns: ColumnConfig<T, keyof T>[]): GridColDef[] {
  return columns.map(col => ({
    field: col.key as string,
    headerName: col.label,
    ...col.gridOptions
  }));
} 
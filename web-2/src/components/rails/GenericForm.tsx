import { useForm, Controller, FieldError } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';
import { Box, Button, Stack, TextField, Switch, FormControlLabel, MenuItem, Alert, AlertTitle, List, ListItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';
import { ColumnConfig, CustomFieldProps } from './column-config';
import { Fragment } from 'react';

interface GenericFormProps<T> {
    schema: ZodSchema;
    onSubmit: (data: any) => void;
    onClose: () => void;
    isLoading: boolean;
    submitLabel: string;
    defaultValues?: Record<string, any>;
    columns: ColumnConfig<T, keyof T>[];
    serverErrors?: Record<string, string[]>;
}

export function GenericForm<T>({
    schema,
    onSubmit,
    onClose,
    isLoading,
    submitLabel,
    defaultValues,
    columns,
    serverErrors
}: GenericFormProps<T>) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: defaultValues ? {
            ...defaultValues,
            // Ensure dates are properly converted to Date objects
            ...Object.entries(defaultValues)
                .filter(([key]) => columns.find(col => col.key === key && col.type === 'date'))
                .reduce((acc, [key, value]) => ({
                    ...acc,
                    [key]: value ? new Date(value) : null
                }), {}),
            // Set default false for boolean fields if not provided
            ...columns
                .filter(col => col.type === 'boolean')
                .reduce((acc, col) => ({
                    ...acc,
                    [col.key as string]: defaultValues[col.key as string] ?? false
                }), {})
        } : {
            // When no defaultValues provided, set false for all boolean fields
            ...columns
                .filter(col => col.type === 'boolean')
                .reduce((acc, col) => ({
                    ...acc,
                    [col.key as string]: false
                }), {})
        },
    });

    console.log(errors)

    const renderField = (column: ColumnConfig<T, keyof T>) => {
        const fieldName = column.key as string;
        const error = errors[fieldName];
        const label = column.label;

        switch (column.type) {
            case 'custom':
                if (!column.customFieldRender) {
                    console.warn(`Custom field ${fieldName} has no render function`);
                    return <Fragment key={fieldName} />;
                }
                return (
                    <Controller
                        key={fieldName}
                        name={fieldName}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Fragment>
                                {column.customFieldRender!({
                                    value,
                                    onChange,
                                    error: !!error,
                                    helperText: error?.message as string,
                                    required: !column.zodSchema.isOptional()
                                })}
                            </Fragment>
                        )}
                    />
                );

            case 'textarea':
                return (
                    <TextField
                        key={fieldName}
                        {...register(fieldName)}
                        label={label}
                        error={!!error}
                        helperText={error?.message as string}
                        fullWidth
                        required={!column.zodSchema.isOptional()}
                        size="small"
                        multiline
                        rows={4}
                        inputProps={{ 'aria-label': label }}
                    />
                );

            case 'boolean':
                return (
                    <Controller
                        key={fieldName}
                        name={fieldName}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={value || false}
                                        onChange={(e) => onChange(e.target.checked)}
                                    />
                                }
                                label={label}
                            />
                        )}
                    />
                );

            case 'date':
                return (
                    <Controller
                        key={fieldName}
                        name={fieldName}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <DatePicker
                                label={label}
                                value={value}
                                onChange={(newValue) => {
                                    // Ensure we're passing a proper Date object or null
                                    onChange(newValue ? new Date(newValue) : null);
                                }}
                                slotProps={{
                                    textField: {
                                        error: !!error,
                                        helperText: error?.message as string,
                                        required: !column.zodSchema.isOptional(),
                                        fullWidth: true,
                                        size: "small"
                                    }
                                }}
                            />
                        )}
                    />
                );

            case 'select':
                return (
                    <TextField
                        key={fieldName}
                        {...register(fieldName)}
                        select
                        label={label}
                        error={!!error}
                        helperText={error?.message as string}
                        fullWidth
                        required={!column.zodSchema.isOptional()}
                        size="small"
                        inputProps={{ 'aria-label': label }}
                    >
                        <MenuItem value="">Select...</MenuItem>
                        {column.selectOptions?.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                );

            case 'number':
                return (
                    <TextField
                        key={fieldName}
                        {...register(fieldName, { valueAsNumber: true })}
                        label={label}
                        type="number"
                        error={!!error}
                        helperText={error?.message as string}
                        fullWidth
                        required={!column.zodSchema.isOptional()}
                        size="small"
                        inputProps={{ 'aria-label': label }}
                    />
                );

            case 'text':
            default:
                return (
                    <TextField
                        key={fieldName}
                        {...register(fieldName)}
                        label={label}
                        type="text"
                        error={!!error}
                        helperText={error?.message as string}
                        fullWidth
                        required={!column.zodSchema.isOptional()}
                        size="small"
                        inputProps={{ 'aria-label': label }}
                    />
                );
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ width: '100%' }}
        >
            <Stack spacing={2}>
                {/* Server Error Summary */}
                {serverErrors && Object.keys(serverErrors).length > 0 && (
                    <Alert severity="error">
                        <AlertTitle>Please fix the following errors:</AlertTitle>
                        <List dense disablePadding>
                            {Object.entries(serverErrors).map(([field, messages]) => (
                                <ListItem key={field} sx={{ py: 0 }}>
                                    • {field}: {messages[0]}
                                </ListItem>
                            ))}
                        </List>
                    </Alert>
                )}

                {/* Form Error Summary */}
                {Object.keys(errors).length > 0 && (
                    <Alert severity="error">
                        <AlertTitle>Please fix the following errors:</AlertTitle>
                        <List dense disablePadding>
                            {Object.entries(errors).map(([field, error]) => {
                                const column = columns.find(col => col.key === field);
                                const label = column?.label || field;
                                const message = (error as FieldError)?.message || 'Invalid value';
                                return (
                                    <ListItem key={field} sx={{ py: 0 }}>
                                        • {label}: {message}
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Alert>
                )}

                {columns.map((column) => renderField(column))}
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
                    {submitLabel}
                </LoadingButton>
            </Stack>
        </Box>
    );
} 
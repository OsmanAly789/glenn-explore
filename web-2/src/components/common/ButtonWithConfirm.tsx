import { ReactNode, useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  ButtonProps,
} from '@mui/material';

interface ButtonWithConfirmProps extends ButtonProps {
  onConfirm: () => void;
  dialogTitle: string;
  dialogContent: ReactNode;
  confirmButtonText?: string;
  cancelButtonText?: string;
  children: ReactNode;
}

export function ButtonWithConfirm({
  onConfirm,
  dialogTitle,
  dialogContent,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  children,
  ...buttonProps
}: ButtonWithConfirmProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <>
      <Button {...buttonProps} onClick={() => setOpen(true)}>
        {children}
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogContent}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} size="small">
            {cancelButtonText}
          </Button>
          <Button
            onClick={handleConfirm}
            color={buttonProps.color || 'primary'}
            variant="contained"
            size="small"
          >
            {confirmButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

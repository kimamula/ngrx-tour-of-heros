import { MatSnackBarConfig } from '@angular/material';

export const SNACKBAR_OPEN = 'app/snackbar/open';
export const SNACKBAR_CLOSE = 'app/snackbar/close';

export interface SnackbarActionPayload {
  [SNACKBAR_OPEN]: {
    message: string,
    action?: string,
    config?: MatSnackBarConfig
  };
  [SNACKBAR_CLOSE]: void;
}

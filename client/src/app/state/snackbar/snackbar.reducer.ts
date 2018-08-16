import {
  SNACKBAR_CLOSE,
  SNACKBAR_OPEN,
  SnackbarActionPayload
} from './snackbar.action';
import { MatSnackBarConfig } from '@angular/material';
import { Reducer } from '../../redux/Reducer';

export const SNACKBAR_NAMESPACE = 'snackbar';

export type SnackbarState = undefined | {
  message: string;
  action?: string;
  config?: MatSnackBarConfig;
};

export interface SnackbarRootState {
  [SNACKBAR_NAMESPACE]: SnackbarState;
}

export const snackbarReducer: Reducer<SnackbarState, SnackbarActionPayload> = (state, action) => {
  switch (action.type) {
    case SNACKBAR_CLOSE:
      return undefined;
    case SNACKBAR_OPEN:
      return action.payload;
    default:
      return state;
  }
};

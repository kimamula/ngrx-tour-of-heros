import { createSelector } from 'reselect';
import { SnackbarRootState } from './snackbar.reducer';

const getSnackbarState = ({ snackbar }: SnackbarRootState) => snackbar;

export const snackbarSetting = createSelector(
  getSnackbarState,
  snackbar => snackbar
);

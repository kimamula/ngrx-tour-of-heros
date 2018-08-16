import { createSelector } from 'reselect';
import { PowersRootState } from './powers.reducer';

const getPowersState = ({ powers }: PowersRootState) => powers;

export const getSelectedPowerId = createSelector(
  getPowersState,
  ({ selectedId }) => selectedId
);

export const getPowerEntities = createSelector(
  getPowersState,
  ({ entities }) => entities
);

export const getAllPowers = createSelector(
  getPowerEntities,
  entities => Object.values(entities)
);

export const getSelectedPower = createSelector(
  getPowerEntities,
  getSelectedPowerId,
  (entities, selectedPowerId) => typeof selectedPowerId === 'number' ? entities[selectedPowerId] : undefined
);

export const isAddPowerDialogShowing = createSelector(
  getPowersState,
  ({ addDialogShow }) => addDialogShow
);

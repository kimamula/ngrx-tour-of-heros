import { Power } from '../../core/models/power.model';

export const ADD_POWER = 'app/powers/addPower';
export const ADD_POWER_DIALOG_CLOSE = 'app/powers/addPowerDialogClose';
export const ADD_POWER_DIALOG_OPEN = 'app/powers/addPowerDialogOpen';
export const DELETE_POWER = 'app/powers/deletePower';
export const LOAD_POWERS = 'app/powers/loadPowers';
export const LOAD_POWER = 'app/powers/loadPower';
export const SELECT_POWER = 'app/powers/selectPower';
export const UPDATE_POWER = 'app/powers/updatePower';

export interface PowersActionPayload {
  [ADD_POWER]: Power;
  [ADD_POWER_DIALOG_CLOSE]: void;
  [ADD_POWER_DIALOG_OPEN]: void;
  [DELETE_POWER]: Power;
  [LOAD_POWERS]: Power[];
  [LOAD_POWER]: Power;
  [SELECT_POWER]: { id: number };
  [UPDATE_POWER]: Power;
}

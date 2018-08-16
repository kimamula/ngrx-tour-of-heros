import {
  ADD_POWER_DIALOG_CLOSE,
  ADD_POWER_DIALOG_OPEN,
  ADD_POWER,
  DELETE_POWER,
  LOAD_POWER,
  LOAD_POWERS,
  SELECT_POWER,
  UPDATE_POWER,
  PowersActionPayload
} from './powers.action';
import { Power } from '../../core/models/power.model';
import { Reducer } from '../../redux/Reducer';

// Hope https://github.com/Microsoft/TypeScript/issues/12754 to be solved
export const POWERS_NAMESPACE = 'powers';

export interface PowersState {
  addDialogShow: boolean;
  selectedId?: number;
  entities: { [id: number]: Power };
}

export interface PowersRootState {
  [POWERS_NAMESPACE]: PowersState;
}

const initialState: PowersState = {
  addDialogShow: false,
  entities: {}
};

export const powersReducer: Reducer<PowersState, PowersActionPayload> = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POWER_DIALOG_CLOSE:
      return { ...state, addDialogShow: false };
    case ADD_POWER_DIALOG_OPEN:
      return { ...state, addDialogShow: true };
    case ADD_POWER:
    case LOAD_POWER:
      return { ...state, entities: { ...state.entities, [action.payload.id]: action.payload }};
    case DELETE_POWER:
      const { [action.payload.id]: _, ...remaining } = state.entities;
      return { ...state, entities: remaining };
    case LOAD_POWERS:
      return { ...state, entities: action.payload.reduce((acc, power) => {
        acc[power.id] = power;
        return acc;
      }, {} as typeof state.entities) };
    case SELECT_POWER:
      return { ...state, selectedId: action.payload.id };
    case UPDATE_POWER:
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.payload.id]: {
            ...state.entities[action.payload.id],
            ...action.payload
          }
        }
      };
    default:
      return state;
  }
};

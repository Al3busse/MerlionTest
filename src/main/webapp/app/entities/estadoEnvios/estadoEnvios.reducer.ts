import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { ISales, defaultValue } from 'app/shared/model/sales.model';

export const ACTION_TYPES = {
  UPDATE_SALE_STATUS: 'estadoEnvios/UPDATE_SALE_STATUS',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ISales>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type SalesState2 = Readonly<typeof initialState>;

// Reducer

export default (state: SalesState2 = initialState, action): SalesState2 => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.UPDATE_SALE_STATUS):
      return {
        ...state,
        updating: true,
        updateSuccess: false,
        loading: false,
        entity: action.payload.data,
      };
    case FAILURE(ACTION_TYPES.UPDATE_SALE_STATUS):
    case SUCCESS(ACTION_TYPES.UPDATE_SALE_STATUS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        loading: false,
        entity: action.payload.data,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/sales';

// Actions

export const updateStatusEntity = (id: number) => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = {
    type: ACTION_TYPES.UPDATE_SALE_STATUS,
    payload: axios.get(requestUrl).then((resp: any) => {
      if (resp) {
        resp.data.state === 'IN_CHARGE'
          ? (resp.data.state = 'SHIPPED')
          : resp.data.state === 'SHIPPED'
          ? (resp.data.state = 'DELIVERED')
          : resp.data.state;
        axios.put(apiUrl, resp.data);
      }
    }),
  };
  return result.payload;
};

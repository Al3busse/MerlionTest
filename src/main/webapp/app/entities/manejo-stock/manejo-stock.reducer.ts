import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IProductBucket, defaultValue } from 'app/shared/model/product-bucket.model';

export const ACTION_TYPES = {
  FETCH_PRODUCTBUCKET_LIST: 'productBucket/FETCH_PRODUCTBUCKET_LIST',

  UPDATE_PRODUCTBUCKET: 'productBucket/UPDATE_PRODUCTBUCKET',

  RESET: 'productBucket/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProductBucket>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type ProductBucketState = Readonly<typeof initialState>;

// Reducer

export default (state: ProductBucketState = initialState, action): ProductBucketState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PRODUCTBUCKET_LIST):
    case REQUEST(ACTION_TYPES.UPDATE_PRODUCTBUCKET):
    case FAILURE(ACTION_TYPES.FETCH_PRODUCTBUCKET_LIST):
    case FAILURE(ACTION_TYPES.UPDATE_PRODUCTBUCKET):
    case SUCCESS(ACTION_TYPES.FETCH_PRODUCTBUCKET_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.UPDATE_PRODUCTBUCKET):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/product-buckets';

// Actions

export const getEntities: ICrudGetAllAction<IProductBucket> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_PRODUCTBUCKET_LIST,
  payload: axios.get<IProductBucket>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const updateEntity: ICrudPutAction<IProductBucket> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PRODUCTBUCKET,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});

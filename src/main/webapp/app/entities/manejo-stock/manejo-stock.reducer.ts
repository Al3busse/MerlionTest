import axios from 'axios';
import { ICrudPutAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IProductBucket, defaultValue } from 'app/shared/model/product-bucket.model';

export const ACTION_TYPES = {
  UPDATE_PRODUCTBUCKET: 'productBucket/UPDATE_PRODUCTBUCKET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProductBucket>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type ProductBucketState2 = Readonly<typeof initialState>;

// Reducer

export default (state: ProductBucketState2 = initialState, action): ProductBucketState2 => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.UPDATE_PRODUCTBUCKET):
    case FAILURE(ACTION_TYPES.UPDATE_PRODUCTBUCKET):
    case SUCCESS(ACTION_TYPES.UPDATE_PRODUCTBUCKET):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/product-buckets';

// Actions

export const updateProductBucket = (id: number, caso: string) => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = {
    type: ACTION_TYPES.UPDATE_PRODUCTBUCKET,
    payload: axios.get(requestUrl).then((resp: any) => {
      switch (caso) {
        case 'InChargeToAvailable':
          if (resp.data.inChargeQuantity > 0) {
            resp.data.inChargeQuantity--, resp.data.availableToSellQuantity++;
          }
          break;
        case 'AvailableToInCharge':
          if (resp.data.availableToSellQuantity > 0) {
            resp.data.availableToSellQuantity--, resp.data.inChargeQuantity++;
          }
          break;
        case 'AvailableToBroken':
          if (resp.data.availableToSellQuantity > 0) {
            resp.data.availableToSellQuantity--, resp.data.brokenQuantity++;
          }
          break;
        case 'BrokenToAvailable':
          if (resp.data.brokenQuantity > 0) {
            resp.data.brokenQuantity--, resp.data.availableToSellQuantity++;
          }
          break;
        default:
          resp.data;
      }
      axios.put(apiUrl, resp.data);
    }),
  };
  return result.payload;
};

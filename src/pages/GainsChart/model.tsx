import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { GainsChartData } from './data.d';
import { fetchGainsData } from './service';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: GainsChartData) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: GainsChartData;
  effects: {
    fetch: Effect;
  };
  reducers: {
    save: Reducer<GainsChartData>;
    clear: Reducer<GainsChartData>;
  };
}

const initState = {
  jasonGains: [],
  qierGains: [],
};

const Model: ModelType = {
  namespace: 'gainsChart',

  state: initState,

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(fetchGainsData);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return initState;
    },
  },
};

export default Model;

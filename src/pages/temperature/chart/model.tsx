import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { TemperatureChartData } from './data.d';
import { fetchTemperatureData } from './service';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: TemperatureChartData) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: TemperatureChartData;
  effects: {
    fetch: Effect;
  };
  reducers: {
    save: Reducer<TemperatureChartData>;
    clear: Reducer<TemperatureChartData>;
  };
}

const initState = {
  temperatureData: [],
};

const Model: ModelType = {
  namespace: 'temperatureChart',

  state: initState,

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(fetchTemperatureData);
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

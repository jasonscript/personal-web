import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { addTodo, query, removeFakeList, updateStatus } from './service';

import { TodoItemDataType } from './data.d';

export interface StateType {
  list: TodoItemDataType[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    appendFetch: Effect;
    submit: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
    appendList: Reducer<StateType>;
  };
}

const statusMap = {
  0: 'default',
  1: 'processing',
  2: 'success',
};

const Model: ModelType = {
  namespace: 'todolist',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(query, payload);
      response.forEach((item: TodoItemDataType) => {
        item.status = statusMap[item.status];
      });
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(query, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *submit({ payload }, { call }) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeFakeList : updateStatus;
      } else {
        callback = addTodo;
      }
      yield call(callback, payload);
      return true;
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    appendList(state = { list: [] }, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
  },
};

export default Model;

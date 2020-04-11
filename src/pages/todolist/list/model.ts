import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { addTodo, query, removeFakeList, updateStatus, updateTodo } from './service';

import { TodoItemDataType } from './data.d';

export interface StateType {
  list: TodoItemDataType[];
  todoCount: number;
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
    fetchCount: Effect;
    submit: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
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
    todoCount: 0,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(query, payload);
      response.forEach((item: TodoItemDataType) => {
        item.status = statusMap[item.status];
      });
      yield put({
        type: 'queryList',
        payload: {
          list: Array.isArray(response) ? response : [],
        },
      });
    },
    *fetchCount({ payload }, { call, put }) {
      const response = yield call(query, payload);
      yield put({
        type: 'queryList',
        payload: {
          todoCount: Array.isArray(response) ? response.length : 0,
        },
      });
    },
    *submit({ payload }, { call }) {
      let callback;
      if (payload.id) {
        const payloadParamsCount = Object.keys(payload).length;
        if (payloadParamsCount === 1) {
          callback = removeFakeList;
        } else if (payloadParamsCount === 2) {
          callback = updateStatus;
        } else {
          callback = updateTodo;
        }
      } else {
        callback = addTodo;
      }
      yield call(callback, payload);
      return true;
    },
  },

  reducers: {
    queryList(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default Model;

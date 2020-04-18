import request from '@/utils/request';
import { getCookie } from '@/utils/utils';
import { TableListParams, StepsDataType } from './data.d';

export async function queryRule(params?: TableListParams) {
  return request('/api/rule', {
    params,
  });
}

export async function removeRule(params: { key: number[] }) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}

/**
 * 查询步数数据
 */
export const querySteps = async () =>
  request('/api-local/steps').then(res => ({ data: res, total: res.length }));

/**
 * 新增步数
 * @param params 步数参数
 */
export const addSteps = async (params: StepsDataType) =>
  request('/api-local/steps', {
    method: 'PUT',
    data: {
      ...params,
    },
    headers: {
      'x-csrf-token': getCookie('csrfToken'),
    },
  });

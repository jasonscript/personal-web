import request from '@/utils/request';
import { getCookie } from '@/utils/utils';
import { TableListParams, TableListItem } from './data.d';

export async function queryTemperature(params?: TableListParams) {
  return request('/api-personal/temperature', {
    params,
  }).then(res => ({ data: res, total: res.length }));
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

export async function addTemperature(params: TableListItem) {
  return request('/api-personal/temperature', {
    method: 'PUT',
    data: {
      ...params,
    },
    headers: {
      'x-csrf-token': getCookie('csrfToken'),
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

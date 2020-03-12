import request from '@/utils/request';
import { getCookie } from '@/utils/utils';
import { TableListParams } from './data.d';

export async function queryGains(params?: TableListParams) {
  return request('/api-local/gains', {
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

export async function addGains(params: TableListParams) {
  return request('/api-local/gains', {
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

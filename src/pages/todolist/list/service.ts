import request from '@/utils/request';
import { getCookie } from '@/utils/utils';
import { TodoItemDataType } from './data.d';

interface ParamsType extends Partial<TodoItemDataType> {
  count?: number;
}

export async function query(params: ParamsType) {
  return request('/api-local/todolist', {
    params,
  });
}

export async function removeFakeList(params: ParamsType) {
  const { count = 5, ...restParams } = params;
  return request('/api/fake_list', {
    method: 'POST',
    params: {
      count,
    },
    data: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addTodo(params: ParamsType) {
  return request('/api-local/todolist', {
    method: 'PUT',
    data: {
      ...params,
    },
    headers: {
      'x-csrf-token': getCookie('csrfToken'),
    },
  });
}

export async function updateStatus({ id, status }: { id: number; status: number }) {
  return request(`/api-local/todolist/${id}`, {
    method: 'POST',
    data: {
      status,
    },
    headers: {
      'x-csrf-token': getCookie('csrfToken'),
    },
  });
}

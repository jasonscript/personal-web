import request from '@/utils/request';
import { getCookie } from '@/utils/utils';
import { TodoItemDataType } from './data.d';

interface ParamsType extends Partial<TodoItemDataType> {
  count?: number;
}

export async function query({ status }: { status: any }) {
  return request('/api-local/todolist', {
    method: 'POST',
    data: {
      status,
    },
    headers: {
      'x-csrf-token': getCookie('csrfToken'),
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

export const updateTodo = async ({ id, ...values }: { id: number; values: TodoItemDataType }) =>
  request(`/api-local/todolist/${id}`, {
    method: 'POST',
    data: {
      ...values,
    },
    headers: {
      'x-csrf-token': getCookie('csrfToken'),
    },
  });

export const delTodo = async ({ id }: { id: number }) =>
  request(`/api-local/todolist/${id}`, {
    method: 'DELETE',
    headers: {
      'x-csrf-token': getCookie('csrfToken'),
    },
  });

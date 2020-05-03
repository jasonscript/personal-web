import request from '@/utils/request';
import { getCookie } from '@/utils/utils';
import { TodoItemDataType } from './data.d';

interface ParamsType extends Partial<TodoItemDataType> {
  count?: number;
}

export async function query({ status }: { status: any }) {
  return request('/api-personal/todolist', {
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
  return request('/api-personal/todolist', {
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
  return request(`/api-personal/todolist/${id}`, {
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
  request(`/api-personal/todolist/${id}`, {
    method: 'POST',
    data: {
      ...values,
    },
    headers: {
      'x-csrf-token': getCookie('csrfToken'),
    },
  });

export const delTodo = async ({ id }: { id: number }) =>
  request(`/api-personal/todolist/${id}`, {
    method: 'DELETE',
    headers: {
      'x-csrf-token': getCookie('csrfToken'),
    },
  });

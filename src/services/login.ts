import request from '@/utils/request';
import { getCookie } from '@/utils/utils';

export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

export async function fakeAccountLogin(params: LoginParamsType) {
  return request('/api-personal/login/account', {
    method: 'POST',
    data: params,
    headers: {
      'x-csrf-token': getCookie('csrfToken'),
    },
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

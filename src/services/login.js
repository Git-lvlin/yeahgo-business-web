import request from '@/utils/request';

export function login(params, options = {}) {
  return request('/open/login/index', {
    method: 'POST',
    data: params,
    ...options
  });
}

export function getCaptcha(params, options = {}) {
  return request('/open/login/captcha', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const getErrorNums = (params = {}, options = {}) => {
  return request('/open/login/errorNums', {
    method: 'POST',
    data: params,
    ...options
  });
}
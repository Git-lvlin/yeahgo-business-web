import request from '@/utils/request';

export const getExpressList = (params, options = {}) => {
  return request('/auth/order/collectiveOrder/express', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const cacheUserAuths = (params, options = {}) => {
  return request('/auth/admin/role/cacheUserAuths', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const detailExt = (params, options = {}) => {
  return request('/auth/user/user/detailExt', {
    method: 'POST',
    data: params,
    ...options
  });
}

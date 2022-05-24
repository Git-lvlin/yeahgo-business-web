import request from '@/utils/request';

export const findAdminOrderDetail = async (params = {}, options = {}) => {
  return request('/auth/jump/url', {
    method: 'POST',
    data: {
      'requestUrl': '/java-admin/order/findAdminOrderDetail',
      ...params,
    },
    ...options
  });
}

export const deliverGoods = async (params = {}, options = {}) => {
  return request('/auth/jump/url', {
    method: 'POST',
    data: {
      'requestUrl': '/java-admin/order/deliverGoods',
      ...params,
    },
    ...options
  });
}


export const expressInfo = async (params = {}, options = {}) => {
  return request('/auth/express/express/expressInfo', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const deleteOrderLogistics = async (params = {}, options = {}) => {
  return request('/auth/jump/url', {
    method: 'POST',
    data: {
      'requestUrl': '/java-admin/order/deleteOrderLogistics',
      ...params,
    },
    ...options
  });
  
}

export const updateOrderLogistics = async (params = {}, options = {}) => {
  return request('/auth/jump/url', {
    method: 'POST',
    data: {
      'requestUrl': '/java-admin/order/updateOrderLogistics',
      ...params,
    },
    ...options
  });
}
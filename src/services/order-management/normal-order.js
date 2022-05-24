import request from '@/utils/request';

export const orderList = async (params = {}, options = {}) => {
  return request('/auth/jump/url', {
    method: 'POST',
    data: {
      'requestUrl': '/java-admin/order/findAdminOrderList',
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

export const batchShip = async (params = {}, options = {}) => {
  return request('/auth/jump/url', {
    method: 'POST',
    data: {
      'requestUrl': '/java-admin/order/list/deliverGoods',
      ...params,
    },
    ...options
  });
}

export const updateDeliveryInfo = async (params = {}, options = {}) => {
  return request('/auth/jump/url', {
    method: 'POST',
    data: {
      'requestUrl': '/java-admin/order/updateDeliveryInfo',
      ...params,
    },
    ...options
  });
}

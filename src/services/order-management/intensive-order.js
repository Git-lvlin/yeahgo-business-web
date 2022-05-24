import request from '@/utils/request';

export const orderList = async (params = {}, options = {}) => {
  return request('/auth/order/collectiveOrder/getSupplierOrderList', {
    method: 'POST',
    data: {
      wholesaleType: 5,
      ...params
    },
    ...options
  });
}

export const orderShip = async (params = {}, options = {}) => {
  return request('/auth/order/collectiveOrder/orderShip', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const batchShip = async (params = {}, options = {}) => {
  return request('/auth/order/collectiveOrder/batchShip', {
    method: 'POST',
    data: params,
    ...options
  });
}


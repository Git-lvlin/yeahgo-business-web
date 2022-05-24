import request from '@/utils/request';

export const getSupplierOrderDetail = async (params = {}, options = {}) => {

  return request('/auth/order/collectiveOrder/getSupplierOrderDetail', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const modifyShip = async (params = {}, options = {}) => {
  return request('/auth/order/collectiveOrder/modifyShip', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const delShip = async (params = {}, options = {}) => { 
  return request('/auth/order/collectiveOrder/delShip', {
    method: 'POST',
    data: params,
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

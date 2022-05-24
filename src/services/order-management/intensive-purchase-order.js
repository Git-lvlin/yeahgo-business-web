import request from '@/utils/request';

export const operationList = async (params = {}, options = {}) => {
  const { current, pageSize, createTime = [], ...rest } = params;
  const res = await request('/auth/order/operation/list', {
    method: 'POST',
    params: {
      page: current,
      size: pageSize,
      beginTime: createTime[0],
      endTime: createTime[1],
      ...rest
    },
    ...options
  });

  return {
    data: res.data.records,
    success: true,
    total: res.data.total
  }
}

export const detail = async (params = {}, options = {}) => {
  return request('/auth/order/operation/detail', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const shipping = async (params = {}, options = {}) => {
  return request('/auth/order/operation/shipping', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const expressEdit = async (params = {}, options = {}) => {
  return request('/auth/order/operation/expressEdit', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const expressDelete = async (params = {}, options = {}) => {
  return request('/auth/order/operation/expressDelete', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const expressInfo = async (params = {}, options = {}) => {
  return request('/auth/order/operation/expressInfo', {
    method: 'POST',
    data: params,
    ...options
  });
}

// 供应商打印待收货订单
export const pendReceiptOrder = async (params = {}, options = {}) => {
  return request('/auth/order/collectiveOrder/pendReceiptOrder', {
    method: 'POST',
    data: params,
    ...options
  });
}
import request from '@/utils/request';

export const getSupplierOrderList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/order/collectiveOrder/getSupplierOrderList', {
    method: 'POST',
    params: {
      page: current,
      size: pageSize,
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

export const getSupplierOrderDetail = (params = {}, options = {}) => {
  return request('/auth/order/collectiveOrder/getSupplierOrderDetail', {
    method: 'POST',
    params,
    ...options
  });
}

// 集约订单发货
export const deliverGoodsNow = (params = {}, options = {}) => {
  return request('/auth/order/collectiveOrder/orderShip', {
    method: 'POST',
    params,
    ...options
  });
}

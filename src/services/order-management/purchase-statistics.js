import request from '@/utils/request';

// 采购订单统计商品列表
export const statsProductOrderList = async (params = {}, options = {}) => {
  const { current, pageSize, time, ...rest } = params
  const res = await request('/auth/order/operation/statsProductOrderList', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      beginTime: time?.[0],
      endTime: time?.[1],
      ...rest
    },
    ...options
  })
  return {
    data: res.data.records,
    success: res.success,
    total: res.data.total
  }
}

// 采购订单统计sku商品列表
export const statsProductSkuList = async (params = {}, options = {}) => {

  const res = await request('/auth/order/operation/statsProductSkuList', {
    method: 'POST',
    data:params,
    ...options
  })
  return {
    data: res.data.records,
    success: res.success,
    total: res.data.total
  }
}
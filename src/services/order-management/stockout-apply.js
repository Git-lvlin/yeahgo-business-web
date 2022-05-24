import request from '@/utils/request';

export const refundList = async (params = {}, options = {}) => {
  const { current, pageSize, dateTimeRange, ...rest } = params
  const res = await request('/auth/order/operation/refundList', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      createTimeBegin: dateTimeRange&& dateTimeRange[0],
      createTimeEnd: dateTimeRange&& dateTimeRange[1],
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


export const refundInfo = async (params = {}, options = {}) => {
  const { ...rest } = params
  const res = await request('/auth/order/operation/refundInfo', {
    method: 'POST',
    data: {
    ...rest
    },
    ...options
  });
  return {
    data: res.data.records,
    success: true,
    code: res.code
  }
}


export const refundCreate = async (params = {}, options = {}) => {
    const { ...rest } = params
    const res = await request('/auth/order/operation/refundCreate', {
      method: 'POST',
      data: {
      ...rest
      },
      ...options
    });
    return {
      data: res.data,
      success: true,
      code: res.code
    }
  }

export const outStockApplyList = async (params = {}, options = {}) => {
const { current, pageSize, createTime, ...rest } = params
const res = await request('/auth/order/operation/outStockApplyList', {
    method: 'POST',
    data: {
    page: current,
    size: pageSize,
    beginTime: createTime&& createTime[0],
    endTime: createTime&& createTime[1],
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
import request from '@/utils/request';

// 售后订单
export const refundPendingApproval = async (params = {}, options = {}) => {
  const { current, pageSize, applyTime, ...rest } = params
  const res = await request('/auth/jump/url', {
    method: 'POST',
    data: {
      requestUrl: '/java-admin/orderReturn/supplier/page',
      page: current,
      size: pageSize,
      beginTime: applyTime&& applyTime[0],
      endTime: applyTime&& applyTime[1],
      ...rest 
    },
    ...options
  });
  return {
    data: res?.data.records,
    success: true,
    total: res?.data.total
  }
}

// 售后订单详情
export const refundOrderDetail = async (params = {}, options = {}) => {
  const res = await request('/auth/jump/url', {
    method: 'POST',
    data: {
      requestUrl: '/java-admin/orderReturn/supplier/detail',
      ...params
    },
    ...options
  })
  return {
    data: res?.data.records,
    success: true,
    total: res?.data.total
  }
}

// 商家同意申请 
export const agreeApply = async (params = {}, options = {}) => {
  const res = await request('/auth/jump/url', {
    method: 'post',
    data: {
      requestUrl: '/java-admin/orderReturn/agreeApply',
      ...params
    },
    ...options
  })
  return {
    data: res?.data.records,
    success: res?.success
  }
}

// 商家拒绝申请 
export const refuseApply = async (params = {}, options = {}) => {
  const res = await request('/auth/jump/url', {
    method: 'post',
    data: {
      requestUrl: '/java-admin/orderReturn/refuseApply',
      ...params
    },
    ...options
  })
  return {
    data: res?.data.records,
    success: res?.success
  }
}

// 同意退款打款
export const agreePayment = async (params = {}, options = {}) => {
  const res = await request('/auth/jump/url', {
    method: 'POST',
    data: {
      requestUrl: '/java-admin/orderReturn/agreePayment',
      ...params
    },
    ...options
  })
  return {
    data: res?.data.records,
    success: res?.success
  }
}

// 拒绝退款打款
export const refusePayment = async (params = {}, options = {}) => {
  const res = await request('/auth/jump/url', {
    method: 'POST',
    data: {
      requestUrl: '/java-admin/orderReturn/refuseRefund',
      ...params
    },
    ...options
  }) 
  return {
    data: res?.data.records,
    success: res?.success
  }
}

// 提交举证信息
export const storeEvidence = async (params = {}, options = {}) => {
  const res = await request('/auth/jump/url', {
    method: 'POST',
    data: {
      requestUrl: '/java-admin/orderReturn/storeEvidence',
      ...params
    },
    ...options
  })
  return {
    data: res?.data.records,
    success: res?.success
  }
}

// 查询物流信息
export const expressInfo = async (params={}, options={}) => {
  const res = await request('/auth/express/express/expressInfo', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res?.data,
    success: res?.success
  }
}

// 订单协商记录
export const findReturnRecord = async (params={}, options={}) => {
  const res = await request('/auth/jump/url', {
    method: 'POST',
    data: {
      requestUrl: '/java-admin/orderReturn/findReturnRecord',
      ...params
    },
    ...options
  })
  return {
    data: res?.data.records,
    success: res?.success
  }
}

// 售后地址列表
export const addressList = async (params={}, options={}) => {
  const res = await request('/auth/user/user/addressList', {
    method: 'POST',
    data: {
      page: 1,
      size: 999,
      ...params
    },
    ...options
  })
  return {
    data: res?.data.records,
    success: res?.success
  }
}

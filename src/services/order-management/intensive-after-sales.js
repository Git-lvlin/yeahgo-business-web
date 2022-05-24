import request from '@/utils/request'

// 集约售后订单列表
export const refundPendingApproval = async (params = {}, options = {}) => {
  const { current, pageSize, applyTime, ...rest } = params
  const res = await request('/auth/order/orderReturn/index', {
    method: 'POST',
    data: {
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

// 集约售后订单详情
export const refundOrderDetail = async (params = {}, options = {}) => {
  const res = await request('/auth/order/orderReturn/detail', {
    method: 'POST',
    data: {
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
  const res = await request('/auth/order/orderReturn/agreeApply', {
    method: 'post',
    data: {
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
  const res = await request('/auth/order/orderReturn/refuseApply', {
    method: 'post',
    data: {
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
  const res = await request('/auth/order/orderReturn/agreeRefund', {
    method: 'POST',
    data: {
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
  const res = await request('/auth/order/orderReturn/refuseRefund', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  }) 
  return {
    data: res?.data.records,
    success: res?.success
  }
}

// 商家平台介入举证
export const storeEvidence = async (params = {}, options = {}) => {
  const res = await request('/auth/order/orderReturn/businessVoucher', {
    method: 'POST',
    data: {
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
  const res = await request('/auth/order/orderReturn/consultationRecord', {
    method: 'POST',
    data: {
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

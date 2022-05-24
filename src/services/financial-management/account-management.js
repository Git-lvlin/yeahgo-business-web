import request from '@/utils/request'

// 帐户信息详情
export const accountManagement = async (params, options = {}) => {
  const res = await request('/auth/jump/url', {
    method: 'POST',
    data: {
      requestUrl: '/java-admin/financial/supplier/account/detail',
      ...params
    },
    ...options
  })

  return {
    data: res?.data.records,
    success: res?.success
  }
}

// 账户流水分页
export const logPage = async (params, options = {}) => {
  const { pageSize, current, createTime, ...rest } = params
  const res = await request('/auth/jump/url', {
    method: 'POST',
    data: {
      requestUrl: '/java-admin/financial/supplier/account/logPage',
      page: current,
      size: pageSize,
      begin: createTime&& createTime[0],
      end: createTime&& createTime[1],
      ...rest
    },
    ...options
  })

  return {
    data: res?.data.records,
    success: res?.success,
    total: res?.data.total
  }
}

// 查询绑定卡
export const query = async (params, options = {}) => {
  const res = await request('/auth/jump/url', {
    method: 'POST',
    data: {
      requestUrl: '/java-admin/financial/supplier/account/query',
      ...params
    },
    ...options
  })

  return {
    data: res?.data.records,
    success: res?.success
  }
}

// 解绑
export const unbind = async (params, options = {}) => {
  const { pageSize, current, ...rest } = params
  const res = await request('/auth/jump/url', {
    method: 'POST',
    data: {
      requestUrl: '/java-admin/financial/supplier/account/unbind',
      page: current,
      size: pageSize,
      ...rest
    },
    ...options
  })

  return {
    data: res?.data.records,
    success: res?.success
  }
}

// 绑卡
export const bind = async (params, options = {}) => {
  const { pageSize, current, ...rest } = params
  const res = await request('/auth/jump/url', {
    method: 'POST',
    data: {
      requestUrl: '/java-admin/financial/supplier/account/bind',
      page: current,
      size: pageSize,
      ...rest
    },
    ...options
  })

  return {
    data: res?.data.records,
    success: res?.success
  }
}

// 解绑发送短信
export const unBindSendSms = async (params, options = {}) => {
  const res = await request('/auth/jump/url', {
    method: 'POST',
    data: {
      requestUrl: '/java-admin/financial/supplier/account/unBindSendSms',
      ...params
    },
    ...options
  })

  return {
    data: res?.data.records,
    success: res?.success
  }
}

// 申请提现
export const apply = async (params, options = {}) => {
  const res = await request('/auth/jump/url', {
    method: 'POST',
    data: {
      requestUrl: '/java-admin/financial/supplier/account/apply',
      ...params
    },
    ...options
  })

  return {
    data: res?.data.records,
    success: res?.success,
    total: res?.total
  }
}

// 获取银行信息
export const findAllBanks = async (params= {}, options= {}) => {
  const res = await request('/auth/jump/url', {
    method: 'POST',
    params: {
      requestUrl: '/java-admin/cms/banks/findAllBanks',
      ...params
    },
    ...options
  })

  return {
    data: res?.data.records,
    success: res?.success
  }
}

// 订单类型
export const orderTypes = async (params={}, options= {}) => {
  const res = await request('/auth/jump/url', {
    method: 'POST',
    data: {
      requestUrl: '/java-admin/financial/common/orderTypes',
      ...params
    },
    ...options
  })

  return {
    data: res.data.records
  }
}
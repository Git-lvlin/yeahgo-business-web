import request from '@/utils/request'

// 修改支付密码
export const updatePwd = async (params, options = {}) => {
  const res = await request('/auth/jump/url', {
    method: 'POST',
    data: {
      requestUrl: '/java-admin/financial/supplier/account/password/update',
      ...params
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success
  }
}

// 重置密码发送短信验证码
export const resetSendSms = async (params, options = {}) => {
  const res = await request('/auth/jump/url', {
    method: 'POST',
    data: {
      requestUrl: '/java-admin/financial/supplier/account/password/resetSendSms',
      ...params
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success
  }
}

// 重置密码校验验证码
export const verifyCode = async (params, options = {}) => {
  const res = await request('/auth/jump/url', {
    method: 'POST',
    data: {
      requestUrl: '/java-admin/financial/supplier/account/password/verifyCode',
      ...params
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success
  }
}
import request from '@/utils/request'

export const withdrawPage = async (params, options = {}) => {
    const { pageSize, current, createTime, ...rest } = params
    const res = await request('/auth/jump/url', {
      method: 'POST',
      data: {
        requestUrl: '/java-admin/financial/supplier/account/withdrawPage',
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
import request from '@/utils/request'

// 创建导出任务
export const createExportTask = async (params = {}, options = {}) => {
  const res = await request('/auth/jump/url', {
    method: 'POST',
    data: {
      'requestUrl': '/java-admin/exportTask/createExportTask',
      ...params,
    },
    ...options
  });
  
  return {
    success: res.success
  }
}

// 导出任务分页查询
export const findByWays = async (params = {}, options = {}) => {
  const res = await request('/auth/jump/url', {
    method: 'POST',
    data: {
      'requestUrl': '/java-admin/exportTask/findByWays',
      ...params,
    },
    ...options
  });

  return {
    data: Array.isArray(res.data.records) ? res.data.records : [],
    total: res?.data?.total,
    success: res?.success
  }
}


import request from '@/utils/request';

// 创建导入任务
export const createImportTask = async (params, options = {}) => {
  const res = await request('/auth/jump/url', {
    method: 'POST',
    data: {
      requestUrl: "/java-admin/importTask/createImportTask",
      ...params
    },
    ...options
  });

  return {
    success: res.success
  }
}

// 导入查询任务分页
export const findPage = async (params, options = {}) => {
  const res = await request('/auth/jump/url', {
    method: 'POST',
    data: {
      requestUrl: "/java-admin/importTask/findPage",
      ...params
    },
    ...options
  });
  return {
    data: Array.isArray(res.data.records) ? res.data.records : [],
    total: res.data.total,
    success: res?.success
  }
}
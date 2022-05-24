import request from '@/utils/request';

export const roleList = async (params, options = {}) => {
  const { current, pageSize, ...rest } = params;

  const res = await request('/auth/admin/role/list', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      ...rest,
    },
    ...options
  });

  return {
    data: res.data.records,
    success: true,
    total: res.data.total
  }
}

export const adminRule = async (params, options = {}) => {
  return request('/auth/admin/rule/commonList', {
    method: 'GET',
    data: params,
    ...options
  });
}

export const roleAdd = async (params, options = {}) => {
  return request('/auth/admin/role/add', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const roleEdit = async (params, options = {}) => {
  return request('/auth/admin/role/edit', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const roleShow = async (params, options = {}) => {
  return request('/auth/admin/role/show', {
    method: 'POST',
    data: params,
    ...options
  });
}

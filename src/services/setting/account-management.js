import request from '@/utils/request';

export const adminList = async (params, options = {}) => {
  const { current, pageSize, ...rest } = params;

  const res = await request('/auth/admin/account/list', {
    method: 'GET',
    params: {
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

export const adminGroup = async (params, options = {}) => {
  return request('/auth/admin/role/list', {
    method: 'GET',
    params,
    ...options
  });
}

export const adminAdd = async (params, options = {}) => {
  return request('/auth/admin/account/add', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const adminEdit = async (params, options = {}) => {
  return request('/auth/admin/account/edit', {
    method: 'POST',
    data: params,
    ...options
  });
}


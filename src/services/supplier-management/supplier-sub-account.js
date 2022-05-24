import request from '@/utils/request';

export const getAccountList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/supplier/account/lists', {
    method: 'GET',
    params: {
      page: current,
      size: pageSize,
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

export const roleList = (params = {}, options = {}) => {
  return request('/auth/supplier/role/lists', {
    method: 'GET',
    params,
    ...options
  });
}

export const details = (params = {}, options = {}) => {
  return request('/auth/supplier/account/details', {
    method: 'GET',
    params,
    ...options
  });
}

export const addAccount = (params = {}, options = {}) => {
  return request('/auth/supplier/account/adds', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const editAccount = (params = {}, options = {}) => {
  return request('/auth/supplier/account/edits', {
    method: 'POST',
    data: params,
    ...options
  });
}
import request from '@/utils/request';

export const addressList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/supplier/user/addressList', {
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


export const getProvinces = (params = {}, options = {}) => {
  return request('/auth/supplier/user/getProvinces', {
    method: 'GET',
    params,
    ...options
  });
}

export const getChildArea = (params = {}, options = {}) => {
  return request('/auth/supplier/user/getChildArea', {
    method: 'GET',
    params,
    ...options
  });
}

export const addressDetail = (params = {}, options = {}) => {
  return request('/auth/supplier/user/addressDetail', {
    method: 'GET',
    params,
    ...options
  });
}

export const addressAdd = (params = {}, options = {}) => {
  return request('/auth/supplier/user/addressAdd', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const addressEdit = (params = {}, options = {}) => {
  return request('/auth/supplier/user/addressEdit', {
    method: 'POST',
    data: params,
    ...options
  });
}
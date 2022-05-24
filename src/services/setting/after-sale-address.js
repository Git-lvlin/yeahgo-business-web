import request from '@/utils/request';

export const addressList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/user/user/addressList', {
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
  return request('/auth/user/user/getProvinces', {
    method: 'GET',
    params,
    ...options
  });
}

export const getChildArea = (params = {}, options = {}) => {
  return request('/auth/user/user/getChildArea', {
    method: 'GET',
    params,
    ...options
  });
}

export const addressDetail = (params = {}, options = {}) => {
  return request('/auth/user/user/addressDetail', {
    method: 'GET',
    params,
    ...options
  });
}

export const addressAdd = (params = {}, options = {}) => {
  return request('/auth/user/user/addressAdd', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const addressEdit = (params = {}, options = {}) => {
  return request('/auth/user/user/addressEdit', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const addressSetDefault = (params = {}, options = {}) => {
  return request('/auth/user/user/addressSetDefault', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const addressSwitch = (params = {}, options = {}) => {
  return request('/auth/user/user/addressSwitch', {
    method: 'POST',
    data: params,
    ...options
  });
}

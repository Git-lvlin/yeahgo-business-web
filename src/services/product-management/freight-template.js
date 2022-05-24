import request from '@/utils/request';

export const postageList = async (params, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/express/express/postageList', {
    method: 'POST',
    data: {
      page: current,
      pageSize,
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

export const postageDetail = (params = {}, options = {}) => {
  return request('/auth/express/express/postageDetail', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const postageSave = (params = {}, options = {}) => {
  return request('/auth/express/express/postageSave', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const findAllProvinces = (params = {}, options = {}) => {
  return request('/auth/express/express/findAllProvinces', {
    method: 'POST',
    data: params,
    ...options
  });
}
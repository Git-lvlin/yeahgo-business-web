import request from '@/utils/request';

export const draftList = async (params, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/goods/product/draftList', {
    method: 'POST',
    data: {
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

export const draftSku = async (params, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/goods/product/draftSku', {
    method: 'POST',
    data: {
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

export const getDetail = (params = {}, options = {}) => {
  return request('/auth/goods/product/draftDetail', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const draftDel = (params = {}, options = {}) => {
  return request('/auth/goods/product/draftDel', {
    method: 'POST',
    data: params,
    ...options
  });
}
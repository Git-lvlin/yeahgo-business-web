import request from '@/utils/request';

export const manageProductSpu = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/goods/product/manageProductSpu', {
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

export const getDetail = (params = {}, options = {}) => {
  return request('/auth/goods/product/detail', {
    method: 'POST',
    data: params,
    ...options
  });
}
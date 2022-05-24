import request from '@/utils/request';

export const stockWarnProductList = async (params, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/goods/product/stockWarnProductList', {
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

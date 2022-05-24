import request from '@/utils/request';
import moment from 'moment';

export const auditedProductList = async (params, options = {}) => {
  const { current, pageSize, createTime = [],  ...rest } = params;
  const res = await request('/auth/goods/product/auditedProductList', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      createTimeStart: createTime[0] && moment(createTime[0]).unix(),
      createTimeEnd: createTime[1] && moment(createTime[1]).unix(),
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
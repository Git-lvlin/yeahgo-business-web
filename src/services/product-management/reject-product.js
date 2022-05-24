import request from '@/utils/request';
import moment from 'moment';

export const rejectProductList = async (params, options = {}) => {
  const { current, pageSize, createTime = [], auditTime = [], ...rest } = params;
  const res = await request('/auth/goods/product/rejectProductList', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      auditTimeStart: auditTime[0] && moment(auditTime[0]).unix(),
      auditTimeEnd: auditTime[1] && moment(auditTime[1]).unix(),
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

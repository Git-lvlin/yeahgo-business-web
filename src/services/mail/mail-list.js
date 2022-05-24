import request from '@/utils/request';

export const messageList = async (params, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/message/message/messageList', {
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
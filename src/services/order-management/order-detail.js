import request from '@/utils/request';

export const findAdminOrderDetail = async (params = {}, options = {}) => {

  return request('/auth/jump/url', {
    method: 'POST',
    data: {
      'requestUrl': '/java-admin/order/findAdminOrderDetail',
      ...params,
    },
    ...options
  });
}
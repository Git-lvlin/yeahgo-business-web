import request from '@/utils/request';

export const getAreas = async () => {
  return request('/auth/user/bankAccount/getAreas', {
    method: 'GET',
  });
}

export const getBanks = async () => {
  const res = await request('/auth/user/bankAccount/getBanks', {
    method: 'GET',
  });

  let data = [];

  if (res.code === 0) {
    data = res.data.records.map(item => ({ label: item.bankName, value: item.bankCode }))
  }

  return data;
}

export const editSupplier = async (params, options = {}) => {
  return request('/auth/user/user/editSupplier', {
    method: 'POST',
    data: params,
    ...options
  });
}
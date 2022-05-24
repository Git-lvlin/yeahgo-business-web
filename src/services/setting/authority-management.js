import request from '@/utils/request';

export const ruleAdd = async (params, options = {}) => {
  return request('/auth/admin/rule/add', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const ruleList = async (params, options = {}) => {
  return request('/auth/admin/rule/list', {
    method: 'GET',
    data: params,
    ...options
  });
}

export const ruleDel = async (params, options = {}) => {
  return request('/auth/admin/rule/del', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const ruleEdit = async (params, options = {}) => {
  return request('/auth/admin/rule/edit', {
    method: 'POST',
    data: params,
    ...options
  });
}


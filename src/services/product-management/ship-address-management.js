import request from '@/utils/request';

export const shipAddrList = async (params, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/user/shipAddrList', {
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


export const shipAddrAdd = async (params = {}, options = {}) => {
    const res = await request('/auth/user/shipAddrAdd', {
        method: 'POST',
        data: params,
        ...options
    });
    return {
        code:res.code,
        data: res.data,
        success: true,
    }
  }
  
export const shipAddrEdit =async (params = {}, options = {}) => {
    const res =await request('/auth/user/shipAddrEdit', {
        method: 'POST',
        data: params,
        ...options
    });
    return {
        code:res.code,
        data: res.data,
        success: true,
    }
}

export const shipAddrDetail =async (params = {}, options = {}) => {
    const res = await request('/auth/user/shipAddrDetail', {
        method: 'POST',
        data: params,
        ...options
    });
    return {
        code:res.code,
        data: res.data.records,
        success: true,
    }
}

export const shipAddrDel =async (params = {}, options = {}) => {
    const res = await request('/auth/user/shipAddrDel', {
        method: 'POST',
        data: params,
        ...options
    });
    return {
        code:res.code,
        data: res.data,
        success: true,
    }
}
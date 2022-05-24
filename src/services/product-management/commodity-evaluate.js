import request from '@/utils/request';

export const getSupComment = async (params, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/jump/url', {
    method: 'POST',
    data: {
      'requestUrl': '/java-admin/cms/comment/getSupComment',
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


export const getSubCommentByCount = async (params, options = {}) => {
    const { current, pageSize, ...rest } = params;
    const res = await request('/auth/jump/url', {
      method: 'POST',
      data: {
        'requestUrl': '/java-admin/cms/comment/getSubCommentByCount',
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

export const getGoods = async (params, options = {}) => {
const { ...rest } = params;
const res = await request('/auth/jump/url', {
    method: 'POST',
    data: {
    'requestUrl': '/java-admin/cms/comment/getGoods',
    ...rest
    },
    ...options
});

return {
    data: res.data.records,
    code:res.code,
    success: true,
}
}

export const subCommentApply = async (params, options = {}) => {
    const { ...rest } = params;
    const res = await request('/auth/jump/url', {
        method: 'POST',
        data: {
        'requestUrl': '/java-admin/cms/comment/subCommentApply',
        ...rest
        },
        ...options
    });
    
    return {
        data: res.data,
        code:res.code,
        success: true,
    }
    }

export const findContent = async (params, options = {}) => {
  const { ...rest } = params;
  const res = await request('/auth/jump/url', {
      method: 'POST',
      data: {
      'requestUrl': '/java-admin/cms/comment/findContent',
      ...rest
      },
      ...options
  });
  
  return {
      data: res.data.records,
      code:res.code,
      success: true,
  }
  }


export const removeApply = async (params, options = {}) => {
  const { ...rest } = params;
  const res = await request('/auth/jump/url', {
      method: 'POST',
      data: {
      'requestUrl': '/java-admin/cms/comment/removeApply',
      ...rest
      },
      ...options
  });
  
  return {
      data: res.data,
      code:res.code,
      success: true,
  }
  }
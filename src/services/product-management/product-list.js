import request from '@/utils/request';
import moment from 'moment';

export const productList = async (params, options = {}) => {
  const { current, pageSize, gcId = [], createTime = [], auditTime = [], ...rest } = params;
  const res = await request('/auth/goods/product/lists', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      gcId1: gcId[0],
      gcId2: gcId[1],
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

export const getConfig = (params = {}, options = {}) => {
  return request('/auth/goods/product/getConfig', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const addGoods = (params = {}, options = {}) => {
  return request('/auth/goods/product/add', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const editGoods = (params = {}, options = {}) => {
  return request('/auth/goods/product/edit', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const getDetail = (params = {}, options = {}) => {
  return request('/auth/goods/product/detail', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const onShelf = (params = {}, options = {}) => {
  return request('/auth/goods/product/onShelf', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const offShelf = (params = {}, options = {}) => {
  return request('/auth/goods/product/offShelf', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const listExport = (params = {}, options = {}) => {
  return request('/auth/goods/product/export', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const brand = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/goods/product/brand', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      ...rest
    },
    ...options
  });

  return {
    data: res?.data?.records,
    success: true,
    total: res?.data?.total
  }
}

export const getTemplateList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/express/express/postageList', {
    method: 'POST',
    data: {
      page: current,
      pageSize,
      ...rest
    },
    ...options
  });

  return {
    data: res?.data?.records,
    success: true,
    total: res?.data?.total
  }
}

export const category = (params = {}, options = {}) => {
  return request('/auth/goods/product/category', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const manageSupplierList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/user/user/manageSupplierList', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      ...rest
    },
    ...options
  });

  return {
    data: res?.data?.records,
    success: true,
    total: res?.data?.total
  }
}

export const draftSave = (params = {}, options = {}) => {
  return request('/auth/goods/product/draftSave', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const modifySkuStock = (params = {}, options = {}) => {
  return request('/auth/goods/product/modifySkuStock', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const proShipAddr = (params = {}, options = {}) => {
  return request('/auth/user/proShipAddr', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const searchUnit = (params = {}, options = {}) => {
  return request('/auth/goods/product/searchUnit', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const getLadderConfig = (params = {}, options = {}) => {
  return request('/auth/goods/product/getLadderConfig', {
    method: 'POST',
    data: params,
    ...options
  });
}
import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { getTemplateList } from '@/services/product-management/product-list';

const FreightTemplateSelect = ({value, onChange, ...rest}) => {
  const [templateData, setTemplateData] = useState([]);

  useEffect(() => {
    getTemplateList({ page: 1, size: 9999 })
      .then(res => {
        setTemplateData(res?.data?.map(item => ({ label: item.expressName, value: item.id })))
      })
    return () => {
      setTemplateData([])
    }
  }, [])

  const changeHandle = (v) => {
    onChange(v)
  }

  return (
    <Select
      placeholder="请选择运费模板"
      options={templateData}
      value={value}
      onChange={changeHandle}
      allowClear
      {...rest}
    />
  )
}

export default FreightTemplateSelect;


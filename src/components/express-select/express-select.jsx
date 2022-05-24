import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { getExpressList } from '@/services/common'


const ExpressSelect = ({ value, onChange, ...rest }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getExpressList()
      .then(res => {
        setData(res?.data?.records?.companyList)
      })
      .finally(()=>{
        setLoading(false);
      })
    
    return () => {
      setData([])
    }
  }, [])

  const changeHandle = (v) => {
    onChange(data.find(item => +item.id === +v))
  }
  return (
    <Select
      placeholder="请选择快递公司"
      options={data.map(item => ({ label: item.expressName, value: item.id }))}
      filterOption={(input, option) =>
        option.label.indexOf(input) >= 0
      }
      showSearch
      value={value?.id}
      onChange={changeHandle}
      loading={loading}
      allowClear
      {...rest}
    />
  )
}

export default ExpressSelect;


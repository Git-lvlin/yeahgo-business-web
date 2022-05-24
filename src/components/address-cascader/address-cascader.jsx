import React, { useState, useEffect, useRef } from 'react';
import { Cascader } from 'antd';
// import { getProvinces, getChildArea } from '@/services/common';
import { arrayToTree } from '@/utils/utils'

const GcCascader = ({ value = [], onChange, fieldProps, areaData, ...rest }) => {
  const [data, setData] = useState([]);
  // const pid = useRef();
  // const loadData = (selectedOptions) => {
  //   const targetOption = selectedOptions[selectedOptions.length - 1];
  //   targetOption.loading = true;
  //   getChildArea({ id: targetOption.value })
  //     .then(res => {
  //       targetOption.loading = false;
  //       targetOption.children = res.data.map(item => ({ label: item.name, value: item.id, isLeaf: !pid.current.includes(item.parentId) }));
  //       if (res.code === 0) {
  //         setData([...data])
  //       }
  //     })
  // }

  const changeHandle = (v, selectedOptions) => {
    onChange(selectedOptions.map(item => ({ label: item.label, value: item.value })))
    // fieldProps?.onChange?.(selectedOptions.map(item => ({ label: item.label, value: item.value })))
  }

  useEffect(() => {
    // console.log('object', )
    // getProvinces()
    //   .then(res => {
    //     if (res.code === 0) {
    //       pid.current = res.data.map(item => item.id)
    //       setData(res.data.map(item => ({ label: item.name, value: item.id, isLeaf: false })))
    //     }
    //   })
    // return () => {
    // }
    const arr = arrayToTree(areaData || window.yeahgo_area)
    let str = JSON.stringify(arr)
    str = str.replace(/name/g, 'label').replace(/id/g, 'value')
    setData(JSON.parse(str))
  }, [])
  return (
    <Cascader value={value?.map(item => item.value)} onChange={changeHandle} options={data} placeholder="请选择" {...rest} />
  )
}

export default GcCascader;


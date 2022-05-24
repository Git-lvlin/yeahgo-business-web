import React, { useState, useEffect, useMemo } from 'react';
import { Button, Form, Input, message, Select, Tag } from 'antd';
import MultiCascader from 'rsuite/lib/MultiCascader';
import 'rsuite/lib/MultiCascader/styles';
import { arrayToTree } from '@/utils/utils'
import './style.less'

const AddressMultiCascader = ({ value = '', onChange = () => { }, data, ...rest }) => {
  const [areaData, setAreaData] = useState([]);
  const [selectAreaKey, setSelectAreaKey] = useState(value);

  const renderMultiCascaderTag = (selectedItems) => {
    const titleArr = [];
    selectedItems.forEach(item => {
      const arr = [];
      let node = item.parent;
      arr.push(item.label)
      while (node) {
        arr.push(node.label)
        node = node.parent;
      }
      titleArr.push({
        label: arr.reverse().join('-'),
        value: item.value
      })
    })

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {
          titleArr.map(item => (
            <Tag
              key={item.value}
              closable
              style={{ marginBottom: 10 }}
              onClose={() => {
                setSelectAreaKey(selectAreaKey.filter(it => it !== item.value))
                onChange(selectAreaKey.filter(it => it !== item.value))
              }}
            >
              {item.label}
            </Tag>
          ))
        }
      </div>
    );
  }

  useEffect(() => {
    const arr = arrayToTree(data || window.yeahgo_area || [])
    let str = JSON.stringify(arr)
    str = str.replace(/name/g, 'label').replace(/id/g, 'value')
    setAreaData(JSON.parse(str))
  }, [data])

  useEffect(() => {
    setSelectAreaKey(value)
  }, [value])
  return (
    <MultiCascader
      value={selectAreaKey}
      data={areaData}
      style={{ width: '100%' }}
      placeholder="请选择"
      renderValue={(a, b) => renderMultiCascaderTag(b)}
      locale={{ searchPlaceholder: '输入省市区名称' }}
      onChange={(v) => { onChange(v); setSelectAreaKey(v) }}
      {...rest}
    />
  )
}

export default AddressMultiCascader;

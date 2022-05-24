import React, { useState, useEffect } from 'react';
import { TreeSelect } from 'antd';
import { proShipAddr } from '@/services/product-management/product-list';

const Delivery = ({ value, onChange, supplierId, ...rest }) => {
  const [gcData, setGcData] = useState([]);

  const changeHandle = (v) => {
    onChange(v)
  }

  useEffect(() => {
    proShipAddr({
      supplierId,
      size: 9999,
    })
      .then(res => {
        if (res.code === 0) {
          if (res.data.records.length) {
            setGcData([{
              value: 0,
              label: `所有发货地都可发货（${res.data.records.length}个发货地）`,
              children: res.data.records.map(item => ({ label: item.name, value: item.id }))
            }])
          }
        }
      });
    return () => {
      setGcData([])
    }
  }, [])

  return (
    <TreeSelect
      multiple value={value} onChange={changeHandle} treeCheckable treeData={gcData} treeExpandedKeys={[0]} placeholder="请选择发货地" {...rest} />
  )
}

export default Delivery;


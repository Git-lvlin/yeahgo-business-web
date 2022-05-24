import React, { useState, useEffect } from 'react';
import { Cascader } from 'antd';
import { detailExt } from '@/services/common';
import { arrayToTree } from '@/utils/utils'

const GcCascader = ({ value, onChange, supplierId, ...rest }) => {
  const [gcData, setGcData] = useState([]);

  const changeHandle = (v) => {
    onChange(v)
  }

  useEffect(() => {
    detailExt({
      supplierId,
    })
      .then(res => {
        if (res.code === 0) {
          const data = res.data.records.gcInfo.filter(item => item.gcShow === 1).map(item => ({
            ...item,
            pid: item.gcParentId,
            label: item.fresh !== 0 ? <>{item.gcName}<span type={item.fresh} style={{ color: 'green' }}>({{ 1: '精装生鲜', 2: '散装生鲜' }[item.fresh]})</span></> : item.gcName,
            value: item.id,
          }))
          setGcData(arrayToTree(data).filter(item => item.children?.length > 0))
        }
      });
    return () => {
      setGcData([])
    }
  }, [])

  return (
    <Cascader value={value} onChange={changeHandle} options={gcData} placeholder="请选择商品品类" {...rest} />
  )
}

export default GcCascader;


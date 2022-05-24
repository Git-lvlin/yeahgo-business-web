import React, { useEffect, useState } from 'react';
import { Cascader, Input, Space } from 'antd';
import { getAreas } from '@/services/setting/account-info'


const Address = ({ value, onChange, disabled, hideInfo = false }) => {
  const [areaData, setAreaData] = useState([]);
  const [area, setArea] = useState(value?.area);
  const [info, setInfo] = useState(value?.info);


  const handleProvinceChange = (val) => {
    setArea(val)
    onChange({
      area: val,
      info,
    })
  };

  const onInfoChang = e => {
    onChange({
      area,
      info: e.target.value
    })
    setInfo(e.target.value)
  }

  useEffect(() => {
    setArea(value?.area)
    setInfo(value?.info)
  }, [value])


  useEffect(() => {
    getAreas()
      .then(res => {
        if (res.code === 0) {
          let dataString = JSON.stringify(res.data.records);
          dataString = dataString.replace(/title/g, 'label').replace(/cities/g, 'children');
          setAreaData(JSON.parse(dataString))
        }
      })

    return () => {
      setAreaData([])
    }
  }, [])
  return (
    <>
      <Space>
        <Cascader value={area} placeholder="请选择所在地区" onChange={handleProvinceChange} disabled={disabled} options={areaData} style={{ width: 470 }} />
      </Space>
      {!hideInfo &&
        <div style={{ marginTop: 10 }}>
          <Input value={info} placeholder="请输入详细地址" value={info} disabled={disabled} onChange={onInfoChang} />
        </div>}
    </>
  )
}

export default Address;

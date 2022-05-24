import React, { useEffect, useState } from 'react';
import { Form, Select, Input, Space } from 'antd';
import { getProvinces, getChildArea } from '@/services/setting/after-sale-address'


const { Option } = Select;

const Address = ({ value, onChange }) => {
  const [provinceData, setProvinceData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [areaData, setAreaData] = useState([]);

  const [province, setProvince] = useState(null);
  const [city, setCity] = useState(null);
  const [area, setArea] = useState(null);
  const [info, setInfo] = useState(value?.info);
  const getCity = (id, cb) => {
    getChildArea({
      id
    }).then(res => {
      setCityData(res.data.records)
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      cb && cb(res.data.records)
    })
  }

  const getArea = (id, cb) => {
    getChildArea({
      id
    }).then(res => {
      setAreaData(res.data.records)
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      cb && cb(res.data.records)
    })
  }

  const handleProvinceChange = (val, obj) => {
    setProvince({
      id: obj.key,
      name: obj.children
    });
    setCity(null);
    setArea(null);
    getCity(val);
    onChange({
      info,
      province: {
        id: obj.key,
        name: obj.children
      },
    })
  };

  const onCityChange = (val, obj) => {
    setArea(null)
    setCity({
      id: obj.key,
      name: obj.children
    });
    getArea(val)
    onChange({
      info,
      province,
      city: {
        id: obj.key,
        name: obj.children
      },
    })
  };

  const onAreaChange = (val, obj) => {
    setArea({
      id: obj.key,
      name: obj.children
    });
    onChange({
      info,
      province,
      city,
      area: {
        id: obj.key,
        name: obj.children
      },
    })
  };

  const onInfoChang = e => {
    onChange({
      province,
      city,
      area,
      info: e.target.value
    })
    setInfo(e.target.value)
  }


  useEffect(() => {
    const provinceId = value?.provinceId;
    const cityId = value?.cityId;
    const areaId = value?.areaId;
    const saveInfo = {}
    getProvinces().then(res => {
      if (res.code === 0) {
        setProvinceData(res.data.records)
        if (provinceId) {
          const obj = res.data.records.find(item => item.id === provinceId);
          saveInfo.province = {
            id: `${obj.id}`,
            name: obj.name
          }
          setProvince(saveInfo.province);
          onChange({
            ...saveInfo,
            province: saveInfo.province,
            info: value.info,
          })
        }
      }
    });

    if (cityId) {
      getCity(provinceId, (data) => {
        const obj = data.find(item => item.id === cityId);
        saveInfo.city = {
          id: `${obj.id}`,
          name: obj.name
        }
        setCity(saveInfo.city);
        onChange({
          ...saveInfo,
          city: saveInfo.city,
          info: value.info,
        })
      })
    }

    if (areaId) {
      getArea(cityId, (data) => {
        const obj = data.find(item => item.id === areaId);
        saveInfo.area = {
          id: `${obj.id}`,
          name: obj.name
        }
        setArea(saveInfo.area);

        onChange({
          ...saveInfo,
          area: saveInfo.area,
          info: value.info,
        })
      })
    }

    return () => {
      setProvinceData([])
    }
  }, [value])
  return (
    <>
      <Space>
        <Select placeholder="请选择省份" value={province?.id} style={{ width: 120 }} onChange={handleProvinceChange}>
          {provinceData.map(item => (
            <Option key={item.id}>{item.name}</Option>
          ))}
        </Select>
        {province?.id && <Select placeholder="请选择城市" value={city?.id} style={{ width: 120 }} onChange={onCityChange}>
          {cityData.map(item => (
            <Option key={item.id}>{item.name}</Option>
          ))}
        </Select>}
        {city?.id && <Select placeholder="请选择地区" value={area?.id} style={{ width: 120 }} onChange={onAreaChange}>
          {areaData.map(item => (
            <Option key={item.id}>{item.name}</Option>
          ))}
        </Select>}
      </Space>
      <div style={{ marginTop: 10 }}>
        <Input value={info} placeholder="请输入详细地址" onChange={onInfoChang} />
      </div>
    </>
  )
}

export default Address;

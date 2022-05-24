import React, { useEffect, useState } from 'react';
import { Checkbox } from 'antd';

const CheckboxGroup = Checkbox.Group;

const App = ({ data, onChange, wrapStyle = {}, disabled }) => {
  const [checkedList, setCheckedList] = useState(data.value);
  const [checkAll, setCheckAll] = useState(data.value.length === data.data.length);
  const [options, setOptions] = useState([]);

  const onChangeHandle = (list) => {
    const arr = data.data.map(item => `${item}`)
    setCheckedList(list);
    onChange(list, arr.concat(list).filter(v => !arr.includes(v) || !list.includes(v)))
    setCheckAll(list.length === data.data.length);
  };

  const onCheckAllChange = (e) => {
    const arr = data.data.map(item => `${item}`)
    setCheckedList(e.target.checked ? arr: []);
    onChange(e.target.checked ? arr : [], e.target.checked ? [] : arr)
    setCheckAll(e.target.checked);
  };
  

  useEffect(() => {
    setOptions(data.data.map(item => {
      const findItem = window.yeahgo_area.find(it => it.id === +item);
      return {
        label: findItem.name,
        value: `${findItem.id}`
      }
    }))
    setCheckedList(data.value)
    setCheckAll(data.value.length === data.data.length);
  }, [data])

  return (
    <div style={{ display: 'flex', ...wrapStyle }}>
      <div style={{ width: 100 }}>
        <Checkbox onChange={onCheckAllChange} checked={checkAll} disabled={disabled}>
          {data.name}
        </Checkbox>
      </div>
      <CheckboxGroup
        options={options}
        value={checkedList}
        onChange={onChangeHandle}
        style={{ flex: 1 }}
        disabled={disabled}
      />
    </div>
  );
};

export default App;

import { Select } from 'antd'
const AddressSelect = ({value, onChange, address}) => {
  const changeHandle = v => {
    onChange(v)
  }
  return (
    <Select
      style={{width: 400}}
      placeholder="请选择收货地址"
      options={address}
      value={value}
      defaultValue={value}
      onChange={changeHandle}
    />
  )
}  

export default AddressSelect

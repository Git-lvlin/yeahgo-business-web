import React from 'react'
import ProForm, {
  ModalForm,
  ProFormText,
} from '@ant-design/pro-form'

import { updateDeliveryInfo } from '@/services/order-management/normal-order'
import AddressCascader from '@/components/address-cascader'

const EditAddress = ({
  subOrderId,
  visible,
  setVisible,
  setChange,
  change
}) => {

  const submitAddress = (v) => {
    return new Promise((resolve, reject)=>{
      updateDeliveryInfo(
        {
          subOrderId,
          consignee: v.consignee,
          phone: v.phone,
          address: v.address,
          provinceId: v.area?.[0].value,
          provinceName: v.area?.[0].label,
          cityId: v.area?.[1].value,
          cityName: v.area?.[1].label,
          districtName: v.area?.[2].label
        },
        {
          showSuccess: true,
          showError: true
        }).then(res => {
          if(res.success) {
            setChange(change+1)
            resolve()
          } else {
            reject()
          }
      })
    })
  }

  return (
    <ModalForm
      title="修改收货地址"
      visible={visible}
      onVisibleChange={setVisible}
      modalProps={{
        destroyOnClose: true,
        onCancel: ()=>{setVisible(false)}
      }}
      onFinish={async (values) => {
        await submitAddress(values)
        return true
      }}
      layout='horizontal'
    >
      <ProFormText
        name='consignee'
        label='收货人'
        rules={[{required: true, message: '请输入收货人'}]}
      />
      <ProFormText
        name='phone'
        label='电话'
        rules={[{required: true, message: '请输入电话'}]}
      />
      <ProForm.Item
        name='area'
        label='所在地区'
        rules={[{required: true, message: '请选择所在地区'}]}
      >
        <AddressCascader/>
      </ProForm.Item>
      <ProFormText
        name='address'
        label='详细地址'
        rules={[{required: true, message: '请输入详细地址'}]}
      />
    </ModalForm>
  )
}

export default EditAddress

import React, { useRef, useEffect, useState } from 'react';
import { message, Form,Space,Button,Modal,Tag} from 'antd';
import ProForm, {
  DrawerForm,
  ProFormText,
} from '@ant-design/pro-form';
import { shipAddrAdd,shipAddrEdit,shipAddrDetail } from '@/services/product-management/ship-address-management';
import { Cascader } from 'rsuite';
import { arrayToTree,getAreaData } from '@/utils/utils'
import AddressMultiCascader from '@/components/address-multi-cascader'



export default (props) => {
  const { detailData, setVisible, onClose, visible,callback } = props;
  const [areaData, setAreaData] = useState([]);
  const formRef = useRef();
  const ref = useRef();
  const [form] = Form.useForm()
  const checkConfirm = (rule, value, callback) => {
    return new Promise(async (resolve, reject) => {
      if (value&&!/(^([0-9]{3,4}-)?[0-9]{7,8}$)|(^1[1-9]{1}[0-9]{9}$)/.test(value)) {
        await reject('只能输入手机号或座机号')
      } else {
        await resolve()
      }
    })
  }
  const onsubmit = (values) => {
    const { ...rest } = values
    const param = {
      provinceId:getAreaData([values.province])[0].provinceId,
      cityId:getAreaData([values.province])[0].cityId,
      areaId:getAreaData([values.province])[0].regionId,
      provinceName:getAreaData([values.province])[0].provinceName,
      cityName:getAreaData([values.province])[0].cityName,
      areaName:getAreaData([values.province])[0].regionName,
      ...rest
    }
    delete param.province
    if (detailData?.id) {
      param.id = detailData?.id
    }
    if(detailData?.id){
      shipAddrEdit(param).then((res) => {
        if (res.code === 0) {
          message.success('编辑成功');
          callback(true)
          setVisible(false)
        }
      })
    }else{
      shipAddrAdd(param).then((res) => {
          if (res.code === 0) {
            message.success('提交成功');
            callback(true)
            setVisible(false)
          }
        })
    }
  };

  useEffect(() => {
    if (detailData?.id) {
      shipAddrDetail({id:detailData?.id}).then(res=>{
        form.setFieldsValue({
          province:res.data?.areaId,
          ...res.data
        })
      })
    }
    const arr = arrayToTree( window.yeahgo_area || [])
    let str = JSON.stringify(arr)
    str = str.replace(/name/g, 'label').replace(/id/g, 'value')
    setAreaData(JSON.parse(str))
  }, [])

  return (
    <DrawerForm
      title={detailData?.id?'编辑发货地信息':"添加发货地信息"}
      onVisibleChange={setVisible}
      formRef={formRef}
      visible={visible}
      form={form}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        onClose: () => {
          onClose();
        }
      }}
      submitter={
        {
          render: (props, defaultDoms) => {
            return [
              <Button type="default" onClick={() => setVisible(false)}>
                 取消
              </Button>,
              <Button type="primary" key="submit" onClick={() => {
                  props.form?.submit?.()
                }}>
                  提交
              </Button>,
            ];
          }
        }
      }
      onFinish={async (values) => {
        await onsubmit(values);
        // 不返回不会关闭弹框
        // return true;
      }}
    >
        <ProFormText 
          width="md"
          name="name"
          label="名称"
          placeholder="请填写发货地的名称"
          rules={[
            { required: true, message: '请填写发货地的名称' },
          ]}
        />

        <ProFormText 
          width="md"
          name="contactName"
          label="联系人姓名"
          placeholder="请输入联系人的姓名"
          rules={[
            { required: true, message: '请输入联系人的姓名' },
          ]}
        />

        <ProFormText 
          width="md"
          name="contactPhone"
          label="联系方式"
          placeholder="请填写联系方式，手机号码或固定电话"
          rules={[
            { required: true, message: '请填写联系方式' },
            { validator: checkConfirm }
          ]}
        />

        <Form.Item
            style={{ marginBottom: '10px' }}
            name='province'
            label="所在区域"
            rules={[{ required: true, message: '请选择所在区域' }]}
          >
            <Cascader
              style={{ width: '330px' }}
              placeholder="请选择所在区域"
              data={areaData}
             />
        </Form.Item>
        <ProFormText 
          width="md"
          name="address"
          placeholder="请填写发货地的详细地址"
        />
        

    </DrawerForm>
  );
};
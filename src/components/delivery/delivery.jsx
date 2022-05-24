import React, { useEffect, useState } from 'react';
import { Form,Select } from 'antd';
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
} from '@ant-design/pro-form';

import { getExpressList } from '@/services/common'
const { Option } = Select;

export default (props) => {
  const { visible, setVisible, callback = () => {}, data,subType,contractUrl } = props;
  const [expressList, setExpressList] = useState([]);
  const [form] = Form.useForm()

  useEffect(() => {
    getExpressList()
      .then(res => {
        if (res.code === 0) {
          setExpressList(res.data.records.companyList)
          if (data?.expressId && data?.expressNo) {
            const arr=res.data.records.companyList.find(item => item.expressName === data?.expressId)
             form.setFieldsValue({
               expressId:arr.id,
               expressNo:data?.expressNo
             })
           }
        }
      });
  }, [data])


  const checkConfirm=(rule, value, callback)=>{
    return new Promise(async (resolve, reject) => {
      if (value&&!/^[A-Za-z0-9]+$/.test(value)) {
        await reject('只能输入字母和数字')
      }
      await resolve()
    })
  }

  const machineVerify=(rule, value, callback)=>{
    return new Promise(async (resolve, reject) => {
      if(value&&value.length<3){
        await reject('最少三个字符')
      }else if (value&&/[^\a-zA-Z\d,\，]+/.test(value)) {
        await reject('只能输入字母、逗号和数字')
      }
      await resolve()
    })
  }

  return (
    <ModalForm
      title="物流信息"
      modalProps={{
        width: 500,
      }}
      form={form}
      onFinish={async (values) => {
        var logistics=expressList.find(item => item.id === values.expressId)
        callback({
          ...values,
          expressName: logistics?.expressName,
          expressType:logistics?.expressType
        })
        return true;
      }}
      onVisibleChange={setVisible}
      visible={visible}
      initialValues={{
        method: 1,
      }}
    >
      {/* <ProFormRadio.Group
        name="method"
        label="物流方式"
        options={[
          {
            label: '快递',
            value: 1,
          },
        ]}
      /> */}
      <Form.Item 
        name="expressId"
        label="快递公司"
        rules={[{ required: true, message: '请选择快递公司' }]}
        >
        <Select
          showSearch
          placeholder="输入快递名称"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.label.indexOf(input) >= 0
          }
          options={
            expressList.map(item => ({ label: item.expressName, value: item.id }))
          }
        />
      </Form.Item>
      <ProFormText
        name="expressNo"
        label="快递单号"
        placeholder="请输入快递单号"
        rules={[
          { required: true, message: '请输入快递单号' },
          { validator: checkConfirm}
        ]}
        fieldProps={{
          maxLength: 50,
        }}
      />
      {
        
        !data?.expressId&&subType==3||!data?.expressId&&subType==4?<ProFormText
        name="deviceImei"
        label="机器ID"
        placeholder="请输入机器ID，3-30个字符之间"
        rules={[
          { required: true, message: '请输入机器ID' },
          { validator: machineVerify}
        ]}
        fieldProps={{
          maxLength: 30,
        }}
      />
      :null
      }
      {
        !data?.expressId&&subType==3||!data?.expressId&&subType==4?<ProFormText
        name="contractUrl"
        label="机器租赁电子合同"
        placeholder="请输入机器ID，3-30个字符之间"
        readonly
        fieldProps={{
          maxLength: 30,
          value:contractUrl?<a href={contractUrl} target="_blank">点击查看</a>:<p style={{color:'#FF2727'}}>未签写</p>
        }}
      />
      :null
      }

    </ModalForm >
  );
};
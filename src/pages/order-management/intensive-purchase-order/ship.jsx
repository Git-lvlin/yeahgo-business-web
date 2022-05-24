import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Select } from 'antd';
import {
  ModalForm,
  ProFormText,
} from '@ant-design/pro-form';
import { getExpressList } from '@/services/common'
import { shipping, expressEdit } from '@/services/order-management/intensive-purchase-order';

export default (props) => {
  const { visible, setVisible, callback, data, type = 1 } = props;
  const [expressList, setExpressList] = useState([]);
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
    layout: {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 14,
      },
    }
  };

  const submit = (values) => {
    return new Promise((resolve, reject) => {
      const apiMethod = type === 1 ? shipping : expressEdit;
      let params = {};

      if (type === 1) {
        params = {
          list: values.express.map((item, index) => ({
            poNo: data.poNo,
            row: index + 1,
            expressNo: item.expressNo,
            expressName: item.expressInfo.label,
          }))
        }
      } else {
        const express = values.express[0];
        params = {
          poNo: data.poNo,
          expressNoOld: data.expressInfo.expressNo,
          supplierId: data.supplierId,
          expressNo: express.expressNo,
          expressName: express.expressInfo.label,
          companyNo: express.expressInfo.value,
          expressId: data.expressInfo.expressId
        }
      }
      apiMethod(params, { showSuccess: true })
        .then(res => {
          if (res.code === 0) {
            callback();
            resolve();
          } else {
            reject();
          }
        })
    });
  }

  useEffect(() => {
    getExpressList()
      .then(res => {
        if (res.code === 0) {
          setExpressList(res.data.records.companyList)
        }
      });
    if (data.expressInfo) {
      form.setFieldsValue({
        express: [{
          expressInfo: { label: data.expressInfo.expressName, value: data.expressInfo.companyNo },
          expressNo: data.expressInfo.expressNo,
        }]
      })
    }
  }, [])

  return (
    <ModalForm
      title={type === 1 ? '确认发货' : '编辑物流信息'}
      modalProps={{
        onCancel: () => form.resetFields(),
      }}
      onVisibleChange={setVisible}
      visible={visible}
      width={800}
      form={form}
      onFinish={async (values) => {
        await submit(values);
        return true;
      }}
      {...formItemLayout}
      initialValues={{
        express: [{
          expressInfo: undefined,
          expressNo: ''
        }]
      }}
    >
      <Form.Item
        label="采购单号"
      >
        {data.poNo}
      </Form.Item>
      <Form.Item
        label="收货人"
      >
        {data.receiptUser}
      </Form.Item>
      <Form.Item
        label="手机号"
      >
        {data.receiptPhone}
      </Form.Item>
      <Form.Item
        label="收货地址"
      >
        {data.receiptAddress}
      </Form.Item>
      <Form.List name="express">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => {
              return (
                <Row key={field.fieldKey}>
                  {type === 1 && <Col span={24}>包裹{field.fieldKey + 1}</Col>}
                  <Col span={10}>
                    <Form.Item
                      {...field}
                      name={[field.name, 'expressInfo']}
                      fieldKey={[field.fieldKey, 'expressInfo']}
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
                        style={{ width: 200 }}
                        labelInValue
                        options={
                          expressList.map(item => ({ label: item.expressName, value: item.expressType }))
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <ProFormText
                      {...field}
                      label="物流单号"
                      name={[field.name, 'expressNo']}
                      fieldKey={[field.fieldKey, 'expressNo']}
                      rules={[{ required: true, message: '' }]}
                      key="2"
                      fieldProps={{
                        style: {
                          width: 200
                        }
                      }}
                    /></Col>
                  <Col span={4}>
                    {fields.length !== 1 && <Button style={{ marginLeft: 10, width: 80 }} onClick={() => { remove(field.name) }} type="primary" danger>
                      删除
                    </Button>}
                  </Col>
                </Row>
              )
            })}
            {type === 1 && <Button style={{ marginTop: 10 }} onClick={() => { add() }} type="primary">
              添加更多包裹
            </Button>}
          </>
        )}
      </Form.List>
    </ModalForm >
  );
};